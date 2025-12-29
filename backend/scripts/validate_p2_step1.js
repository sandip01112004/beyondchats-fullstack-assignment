const scraperService = require("../src/services/scraper.service");

const runValidation = async () => {
    console.log("Phase 2 Step 1: Validating Generic Scraper (Puppeteer)...");

    // 1. Test a known robust site
    const wikiUrl = "https://en.wikipedia.org/wiki/Artificial_intelligence";
    console.log(`\n1. Target: ${wikiUrl}`);
    const wikiText = await scraperService.scrapeGenericUrl(wikiUrl);

    console.log(`   Length: ${wikiText.length} chars`);
    if (wikiText.length > 500) {
        console.log("   [PASS] Scraped substantial content.");
    } else {
        console.error("   [FAIL] Content too short.");
        process.exit(1);
    }

    // 2. Test a tech blog (Medium-style or similar)
    // We use a safe one.
    const blogUrl = "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview";
    console.log(`\n2. Target: ${blogUrl}`);
    const blogText = await scraperService.scrapeGenericUrl(blogUrl);

    console.log(`   Length: ${blogText.length} chars`);
    if (blogText.length > 500) {
        console.log("   [PASS] Scraped MDN content.");
    } else {
        console.error("   [FAIL] Content too short.");
        process.exit(1);
    }

    // 3. Test Invalid URL (Should recover, not crash)
    const badUrl = "https://this-is-not-a-real-site-xyz-123.com";
    console.log(`\n3. Target: ${badUrl}`);
    const badText = await scraperService.scrapeGenericUrl(badUrl);
    console.log(`   Result: "${badText}" (Should be empty string)`);

    if (badText === "") {
        console.log("   [PASS] Handled invalid URL gracefully.");
    } else {
        console.error("   [FAIL] Should return empty string for bad URL.");
        process.exit(1);
    }

    console.log("\n✅ Step 1 Validation SUCCESS: Generic Scraper is ready.");
};

runValidation();
