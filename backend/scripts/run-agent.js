require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const { Article } = require('../src/models/Article');
const agentService = require('../src/services/agent.service');

// Default URI if not in env
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/beyond-chats";

async function run() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected.");

        // Optional: Seed a dummy article if we want to confirm it works
        // Uncomment to seed: 

        /*
        const dummy = new Article({
            title: "The Future of AI in 2025",
            content: "AI is growing fast. Robots are coming.",
            url: "https://example.com/test-article-" + Date.now(),
            status: "scraped"
        });
        await dummy.save();
        console.log("Seeded dummy article:", dummy._id);
        */


        await agentService.processNextArticle();

    } catch (error) {
        console.error("Runner Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
}

run();
