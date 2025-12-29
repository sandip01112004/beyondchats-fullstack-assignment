const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const { Article } = require("../src/models/Article");
const scraperService = require("../src/services/scraper.service");

// Mock process.env
process.env.MONGODB_URI = "mongodb://mock";

const runValidation = async () => {
    console.log("Starting Phase 1 Validation...");

    let mongoServer;

    try {
        // 1. Start In-Memory DB
        console.log("1. Starting MongoDB Memory Server...");
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
        console.log("   [PASS] MongoDB Connected");

        // 2. Test Scraper Logic (Real Network Call)
        console.log("2. Running Scraper (Target: beyondchats.com)...");
        // We limit to 5 articles as per requirement
        const scrapedData = await scraperService.getOldestArticles(5);

        console.log(`   Scraped ${scrapedData.length} articles.`);

        if (scrapedData.length === 0) {
            throw new Error("Scraper returned 0 articles!");
        }

        // Check content of first article
        const first = scrapedData[0];
        if (!first.title || !first.content || !first.url) {
            throw new Error("Scraped article missing fields!");
        }
        console.log("   [PASS] Scraper Logic");

        // 3. Test Database Storage
        console.log("3. Saving to Database...");
        for (const data of scrapedData) {
            await Article.create(data);
        }

        const count = await Article.countDocuments();
        console.log(`   DB Count: ${count}`);

        if (count !== scrapedData.length) {
            throw new Error(`DB Count mismatch! Expected ${scrapedData.length}, got ${count}`);
        }
        console.log("   [PASS] Database Storage");

        // 4. Verify Content Requirements
        console.log("4. Verifying Content...");
        const oneArticle = await Article.findOne();
        if (oneArticle.content.length < 50) {
            throw new Error("Article content seems too short (empty HTML?)");
        }
        console.log("   [PASS] Content Verification");

        console.log("\n✅ validation SUCCESS: Phase 1 is complete and robust.");

    } catch (error) {
        console.error("\n❌ Validation FAILED:", error);
        process.exit(1);
    } finally {
        if (mongoServer) {
            await mongoose.disconnect();
            await mongoServer.stop();
        }
    }
};

runValidation();
