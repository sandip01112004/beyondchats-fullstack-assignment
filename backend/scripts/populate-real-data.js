require('dotenv').config();
const mongoose = require('mongoose');
const scraperService = require('../src/services/scraper.service');
const { Article } = require('../src/models/Article');

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/beyond-chats";

async function populate() {
    console.log("🚀 Starting Real Data Population...");
    console.log("Target: BeyondChats Blog (Oldest 5 Articles)");

    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to DB");

        // 1. Clear existing data
        console.log("🧹 Clearing existing articles...");
        await Article.deleteMany({});
        console.log("✅ DB Cleared.");

        // 2. Scrape
        console.log("🕷️  Scraping started (this may take 1-2 mins)...");
        // Passing 5 to get 5 articles
        const articles = await scraperService.getOldestArticles(5);

        if (articles.length === 0) {
            console.error("❌ No articles scraped! Check internet connection or selector changes.");
            return;
        }

        console.log(`✅ Scraped ${articles.length} articles.`);

        // 3. Save
        console.log("💾 Saving to database...");
        for (const data of articles) {
            // Ensure distinctness just in case
            const exists = await Article.findOne({ url: data.url });
            if (!exists) {
                // Set status to 'scraped' explicitly
                const article = new Article({
                    ...data,
                    status: 'scraped'
                });
                await article.save();
                console.log(`   + Saved: ${article.title}`);
            }
        }

        console.log("\n🎉 POPULATION COMPLETE!");
        console.log("You can now restart the backend/frontend servers and see Real Data.");

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("👋 Disconnected.");
        process.exit();
    }
}

populate();
