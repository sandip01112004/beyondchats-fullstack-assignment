require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function debug() {
    const key = process.env.GEMINI_API_KEY;
    console.log("API Key loaded:", !!key);
    if (key) {
        console.log("API Key prefix:", key.substring(0, 4) + "...");
    } else {
        console.error("API KEY IS MISSING!");
        return;
    }

    const genAI = new GoogleGenerativeAI(key);

    async function tryModel(modelName) {
        try {
            console.log(`\nTesting model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Test");
            console.log(`Success! Response: ${result.response.text()}`);
            return true;
        } catch (e) {
            console.error(`Failed ${modelName}:`);
            console.error(e.toString());
            // Print full error object properties if possible
            if (e.response) {
                console.error("Response status:", e.response.status);
                console.error("Response statusText:", e.response.statusText);
            }
            return false;
        }
    }

    await tryModel("gemini-1.5-flash");
    await tryModel("gemini-pro");
    await tryModel("gemini-1.0-pro");
}

debug();
