const searchService = require("../src/services/search.service");

const runValidation = async () => {
    console.log("Phase 2 Step 2: Validating Search Service...");

    // 1. Test "AI Benefits"
    const query = "benefits of artificial intelligence in healthcare blog";
    console.log(`\nQuery: "${query}"`);

    const start = Date.now();
    const urls = await searchService.searchBlogs(query);
    const duration = Date.now() - start;

    console.log(`Time: ${duration}ms`);
    console.log("Results:");
    urls.forEach((u, i) => console.log(`  ${i + 1}. ${u}`));

    if (!urls || urls.length !== 2) {
        console.error("❌ Failed: Did not return 2 URLs.");
        process.exit(1);
    }

    const isYoutube = urls.some(u => u.includes("youtube.com"));
    if (isYoutube) {
        console.error("❌ Failed: Returned YouTube link (Filtering failure).");
        process.exit(1);
    }

    console.log("\n✅ Step 2 Validation SUCCESS: Search Service returns clean URLs.");
};

runValidation();
