const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { ApiError } = require("../utils/ApiError");

/**
 * BeyondChats Blog Scraper
 * 
 * Strategy:
 * 1. Pagination: We need to find the "Oldest" articles.
 *    - Visit Page 1 -> Find "Last Page" number or "Next" button.
 *    - Traverse to the last page.
 * 2. Extraction: On the last page, take articles from the bottom (oldest).
 *    - If < 5 articles, go to (LastPage - 1) and take more.
 */

const BASE_URL = "https://beyondchats.com/blogs";

// Utility to fetch page HTML
const fetchPage = async (url) => {
    try {
        const { data } = await axios.get(url);
        return cheerio.load(data);
    } catch (error) {
        throw new ApiError(500, `Failed to fetch URL: ${url}`, [], error.stack);
    }
};

const getOldestArticles = async (limit = 5) => {
    console.log("Starting scrape for oldest articles...");
    let $ = await fetchPage(BASE_URL);

    // 1. Find Max Page Number
    // Standard WP pagination: .page-numbers, .pagination
    // We look for the last number in the pagination list.
    // If no pagination, assume Page 1 is the only page.
    let maxPage = 1;
    const paginationLinks = $(".page-numbers, .pagination a").map((i, el) => $(el).text()).get();

    // Extract numbers from pagination text (e.g., "1", "2", "...", "15", "Next")
    const pageNumbers = paginationLinks
        .map(txt => parseInt(txt.replace(/\D/g, '')))
        .filter(num => !isNaN(num));

    if (pageNumbers.length > 0) {
        maxPage = Math.max(...pageNumbers);
    }

    console.log(`Detected max page: ${maxPage}`);

    let assembledArticles = [];
    let currentPage = maxPage;

    // 2. Iterate backwards from last page
    while (assembledArticles.length < limit && currentPage >= 1) {
        const pageUrl = currentPage === 1 ? BASE_URL : `${BASE_URL}/page/${currentPage}/`;
        console.log(`Scraping list page: ${pageUrl}`);

        $ = await fetchPage(pageUrl);

        // Get all article links on this page
        // Selectors: Common WordPress/Blog classes
        const articleLinks = [];
        $("article, .post, .blog-post").each((i, el) => {
            const link = $(el).find("h2 a, .entry-title a, .post-title a").attr("href");
            if (link) articleLinks.push(link);
        });

        // We want the OLDEST on this page.
        // Usually list is Newest (top) -> Oldest (bottom).
        // So on the Last Page, the Bottom-most article is the absolute oldest.
        // We reverse logic: We want to collect from Bottom -> Top of the list.
        // Wait, on Page N (Last Page), the items are displayed Newest -> Oldest (relative to that page).
        // But Page N contains the oldest items overall.
        // So the last item on Page N is the OLDEST article of the entire site.
        // So we should reverse the array of links on this page to get [Oldest, 2nd Oldest...]
        articleLinks.reverse();

        for (const link of articleLinks) {
            if (assembledArticles.length >= limit) break;

            // Avoid duplicates
            if (assembledArticles.some(a => a.url === link)) continue;

            try {
                const articleData = await scrapeArticleDetail(link);
                if (articleData) {
                    assembledArticles.push(articleData);
                }
            } catch (err) {
                console.error(`Failed to scrape article ${link}: ${err.message}`);
            }
        }

        currentPage--;
    }

    return assembledArticles;
};

const scrapeArticleDetail = async (url) => {
    console.log(`Fetching article detail: ${url}`);
    const $ = await fetchPage(url);

    // Selectors
    // Title: h1.entry-title
    // Content: .entry-content
    // Date: .entry-date, time

    const title = $("h1.entry-title, h1.post-title, h1").first().text().trim();

    // Remove scripts, styles from content
    $(".entry-content script, .entry-content style, .entry-content .sharedaddy").remove();
    let content = $(".entry-content, .post-content, article .content").html() || "";

    // Clean up content
    content = content.trim();

    const publicationDateStr = $("time.entry-date, .posted-on time, .date").first().attr("datetime") ||
        $("time").first().text().trim();

    const publicationDate = publicationDateStr ? new Date(publicationDateStr) : new Date();

    if (!title || !content) {
        console.warn(`Missing title or content for ${url}`);
        return null;
    }

    return {
        title,
        content,
        url,
        publicationDate,
        source: "BeyondChats"
    };
};


/**
 * Scrapes generic text content from any URL using Puppeteer.
 * @param {string} url 
 * @returns {Promise<string>} Cleaned text content
 */
const scrapeGenericUrl = async (url) => {
    console.log(`[Generic Scraper] Visit: ${url}`);
    let browser = null;

    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        const page = await browser.newPage();

        // Block resources to speed up
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        // Set user agent to avoid bot detection
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // Navigate with timeout
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Extract Text from Paragraphs
        const content = await page.evaluate(() => {
            // Helper to clean text
            const cleanText = (txt) => txt.replace(/\s+/g, ' ').trim();

            const pTags = Array.from(document.querySelectorAll('p'));

            return pTags
                .map(p => cleanText(p.innerText))
                // Filter short/navigational text
                .filter(txt => txt.length > 50)
                // Filter cookie warnings
                .filter(txt => !txt.toLowerCase().includes("cookie policy"))
                .join('\n\n');
        });

        if (!content || content.length < 100) {
            console.warn(`[Generic Scraper] Warning: Low content length (${content?.length}) for ${url}`);
            // Fallback: Try collecting all body text if P tags fail
            const bodyText = await page.evaluate(() => document.body.innerText);
            return bodyText.length > 200 ? bodyText.substring(0, 5000) : "";
        }

        return content;

    } catch (error) {
        console.error(`[Generic Scraper] Failed to scrape ${url}: ${error.message}`);
        // Do NOT throw. The agent should continue even if one source fails.
        return "";
    } finally {
        if (browser) await browser.close();
    }
};

module.exports = {
    getOldestArticles,
    scrapeGenericUrl
};
