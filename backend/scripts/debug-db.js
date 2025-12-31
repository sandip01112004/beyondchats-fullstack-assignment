require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

console.log("DEBUG: MOOGO_URI from .env:", MONGO_URI ? MONGO_URI.substring(0, 20) + "..." : "UNDEFINED");

async function check() {
    try {
        const conn = await mongoose.connect(MONGO_URI); // Use env var directly
        console.log("DEBUG: Connected to HOST:", conn.connection.host);

        // Check collection directly
        const count = await conn.connection.db.collection('articles').countDocuments();
        console.log("DEBUG: Article Count in 'articles' collection:", count);

        const collections = await conn.connection.db.listCollections().toArray();
        console.log("DEBUG: Collections:", collections.map(c => c.name));

    } catch (error) {
        console.error("DEBUG Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

check();
