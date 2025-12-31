require('dotenv').config();
const mongoose = require('mongoose');
const agentService = require('../src/services/agent.service');
const { Article } = require('../src/models/Article');

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/beyond-chats";

async function processAll() {
    try {
        console.log("🚀 Connectng to DB...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected.");

        let pendingCount = await Article.countDocuments({ status: 'scraped' });
        console.log(`\n📋 Pending Articles: ${pendingCount}`);

        while (pendingCount > 0) {
            console.log(`\n⚙️ Processing article... (${pendingCount} remaining)`);
            const result = await agentService.processNextArticle();

            if (!result) {
                console.log("⚠️ No result returned, possibly caught up or error.");
                break;
            }

            console.log(`✅ Processed: "${result.title}"`);

            // Re-check count
            pendingCount = await Article.countDocuments({ status: 'scraped' });
        }

        console.log("\n🎉 All articles processed!");

    } catch (error) {
        console.error("❌ Runtime Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("👋 Disconnected.");
    }
}

processAll();
