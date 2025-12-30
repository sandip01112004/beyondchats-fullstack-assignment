require('dotenv').config();
const mongoose = require('mongoose');
const { Article } = require('./src/models/Article');

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/beyond-chats";

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        const count = await Article.countDocuments();
        console.log(`\nTotal Articles: ${count}`);

        const articles = await Article.find({});
        articles.forEach(a => {
            console.log(`- [${a.status}] ${a.title} (ID: ${a._id})`);
        });

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

check();
