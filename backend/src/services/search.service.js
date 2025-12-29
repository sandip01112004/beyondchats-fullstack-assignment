const puppeteer = require("puppeteer");

/**
 * Google Search Service (Puppeteer)
 * 
 * Strategy:
 * 1. Perform a Google Search.
 * 2. Extract organic links (div.g a).
 * 3. Filter out junk (Ads, YouTube, Social Media, internal Google links).
 * 4. Return top 2 valid results.
 * 
 * Fallback:
 * If Google blocks us (Captcha/429), return harmless mock URLs.
 */

// Domain blacklist
const BLACKLIST_DOMAINS = [
    "youtube.com", "facebook.com", "twitter.com", "instagram.com", "tiktok.com",
    "linkedin.com", "reddit.com", "google.com", "amazon.com", "pinterest.com",
    "wikipedia.org" // Usually we want blogs, not wiki, but debatable. Keeping it out for now.
];

// Extension blacklist
const BLACKLIST_EXT = [".pdf", ".doc", ".docx", ".ppt", ".xml"];

const runPuppeteerSearch = async (query) => {
    let browser = null;
    try {
        console.log(`[Search Service] Searching Google for: "${query}"`);

        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        const page = await browser.newPage();

        // Stealth: User Agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // Go to Google
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });

        // Extract Links
        // Google's organic results usually sit in `div.g` or `div#search a`
        const links = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('div#search a'));
            return anchors
                .map(a => a.href)
                .filter(href => href && href.startsWith('http'));
        });

        console.log(`[Search Service] Found ${links.length} raw links.`);

        // Filter Links
        const validLinks = [];
        const seenHosts = new Set(); // Avoid 2 links from same site

        for (const link of links) {
            if (validLinks.length >= 2) break;

            try {
                const urlObj = new URL(link);
                const hostname = urlObj.hostname.replace('www.', '');

                // 1. Check Duplicates
                if (seenHosts.has(hostname)) continue;

                // 2. Check Blacklist Domains
                if (BLACKLIST_DOMAINS.some(d => hostname.includes(d))) continue;

                // 3. Check Extensions
                if (BLACKLIST_EXT.some(ext => urlObj.pathname.toLowerCase().endsWith(ext))) continue;

                validLinks.push(link);
                seenHosts.add(hostname);
            } catch (err) {
                // Invalid URL string, skip
            }
        }

        if (validLinks.length === 0) {
            throw new Error("No valid organic links found (Google structure might have changed or Captcha triggered).");
        }

        return validLinks;

    } catch (error) {
        console.error(`[Search Service] Puppeteer failed: ${error.message}`);
        return null; // Signal to use fallback
    } finally {
        if (browser) await browser.close();
    }
};

/**
 * Main Search Function
 * @param {string} query 
 * @returns {Promise<string[]>} Array of 2 URLs
 */
const searchBlogs = async (query) => {
    // 1. Try Live Search
    const results = await runPuppeteerSearch(query);

    if (results && results.length > 0) {
        return results;
    }

    // 2. Fallback (Mock)
    console.warn("[Search Service] Falling back to Mock Mock data.");
    return [
        "https://techcrunch.com/category/artificial-intelligence/",
        "https://www.wired.com/tag/artificial-intelligence/"
    ];
};

module.exports = { searchBlogs };
