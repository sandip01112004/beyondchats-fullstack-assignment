require('dotenv').config();
const mongoose = require('mongoose');
const { Article } = require('./src/models/Article');

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/beyond-chats";

async function seed() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected.");

        // Clear existing (optional, maybe unsafe if user has real data, but currently empty)
        // await Article.deleteMany({});

        // 1. Create a "Scraped" Article
        const scrapedArticle = new Article({
            title: "The Rise of Agentic AI [Demo]",
            content: "<p>Agentic AI is the next phase of artificial intelligence...</p>",
            url: "https://example.com/demo-source-1",
            status: "scraped",
            author: "TechCrunch (Mock)"
        });
        await scrapedArticle.save();
        console.log("Created Scraped Article:", scrapedArticle.title);

        // 2. Create a "Rewritten" Article
        const rewrittenArticle = new Article({
            title: "Why Agentic AI Matters [Rewritten Demo]",
            content: "# Agentic AI: The Future\n\nAgentic AI represents a shift...",
            url: "https://example.com/demo-rewritten-1",
            status: "rewritten",
            originalArticleId: scrapedArticle._id,
            author: "BeyondChats AI"
        });
        await rewrittenArticle.save();
        console.log("Created Rewritten Article:", rewrittenArticle.title);

        console.log("Seeding Complete!");

    } catch (error) {
        console.error("Seed Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
}

seed();
