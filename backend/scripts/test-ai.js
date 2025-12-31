require('dotenv').config({ path: '../.env' });
const aiService = require('../src/services/ai.service');

async function testRewrite() {
    console.log("Testing AI Service...");

    const originalArticle = `
    Node.js is great. It uses JavaScript. You can build servers with it. 
    It is single threaded but fast. Many companies use it like Netflix.
  `;

    const references = [
        `
    Modern backend development relies heavily on efficient runtimes. 
    Node.js stands out due to its non-blocking I/O model, making it ideal for scalable applications.
    `
    ];

    try {
        console.log("Sending request to Gemini...");
        const rewritten = await aiService.rewriteArticle(originalArticle, references);
        console.log("\n--- Rewritten Article ---\n");
        console.log(rewritten);
        console.log("\n-------------------------\n");
        console.log("Test Passed!");
    } catch (error) {
        console.error("Test Failed:", error.message);
    }
}

testRewrite();
