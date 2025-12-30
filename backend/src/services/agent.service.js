const { Article } = require("../models/Article");
const searchService = require("./search.service");
const scraperService = require("./scraper.service");
const aiService = require("./ai.service");

/**
 * Agent Orchestrator Service
 * Manages the lifecycle of content transformation:
 * 1. DB -> 2. Search -> 3. Scrape -> 4. AI -> 5. DB
 */
class AgentService {

    /**
     * Processes a single 'scraped' article from the database.
     * @returns {Promise<Object|null>} The result of the operation or null if no pending articles.
     */
    async processNextArticle() {
        console.log("\n[Agent] --------- Starting Workflow ---------");
        let originalArticle = null;

        try {
            // Step 1: Fetch ONE article with status = "scraped"
            // We verify 'originalArticleId' is null to ensure we don't pick up already rewritten ones (just in case status logic fails)
            originalArticle = await Article.findOne({
                status: "scraped",
                originalArticleId: null
            });

            if (!originalArticle) {
                console.log("[Agent] No pending 'scraped' articles found. Sleeping.");
                return null;
            }

            console.log(`[Agent] Step 1: Found Article ID: ${originalArticle._id} | Title: "${originalArticle.title}"`);

            // Mark as processing to prevent race conditions (if running multiple agents)
            originalArticle.status = "processing";
            await originalArticle.save();


            // Step 2: Search for competitors
            console.log(`[Agent] Step 2: Searching for competitors...`);
            const competitorUrls = await searchService.searchBlogs(originalArticle.title);
            console.log(`[Agent] Found ${competitorUrls.length} competitor URLs:`, competitorUrls);


            // Step 3: Scrape competitor content
            console.log(`[Agent] Step 3: Scraping competitors...`);
            // Run scrapes in parallel for efficiency
            const scrapePromises = competitorUrls.map(url => scraperService.scrapeGenericUrl(url));
            const competitorTexts = await Promise.all(scrapePromises);

            // Filter out empty results
            const validCompetitorTexts = competitorTexts.filter(text => text && text.length > 200);
            console.log(`[Agent] Successfully scraped ${validCompetitorTexts.length}/${competitorUrls.length} valid references.`);


            // Step 4: AI Rewrite
            console.log(`[Agent] Step 4: Sending to Gemini AI...`);
            const rewrittenContent = await aiService.rewriteArticle(originalArticle.content, validCompetitorTexts);
            console.log(`[Agent] AI generation complete. Length: ${rewrittenContent.length} chars.`);


            // Step 5: Save Result
            console.log(`[Agent] Step 5: Saving result to Database...`);

            // Create the NEW rewritten article
            const newArticle = new Article({
                title: originalArticle.title, // Keep same title or ask AI to generate new one (keeping same for now)
                content: rewrittenContent,
                url: `${originalArticle.url}-rewritten`, // Unique dummy URL identifier
                author: "BeyondChats AI",
                status: "rewritten",
                originalArticleId: originalArticle._id,
                references: competitorUrls.map(url => ({ url, title: "Competitor Reference" })),
                metadata: {
                    processingTimeMs: Date.now() - new Date(originalArticle.updatedAt).getTime(),
                    modelUsed: "gemini-1.5-flash"
                }
            });

            await newArticle.save();

            // Update original article status
            originalArticle.status = "rewritten";
            await originalArticle.save();

            console.log(`[Agent] SUCCESS! New Article ID: ${newArticle._id}`);
            console.log("[Agent] --------- Workflow Complete ---------");

            return newArticle;

        } catch (error) {
            console.error(`[Agent] CRITICAL ERROR: ${error.message}`);

            if (originalArticle) {
                // Revert or mark as failed
                console.log(`[Agent] Marking article ${originalArticle._id} as 'failed'.`);
                originalArticle.status = "failed";
                await originalArticle.save().catch(e => console.error("Failed to update status:", e));
            }
            return null;
        }
    }
}

module.exports = new AgentService();
