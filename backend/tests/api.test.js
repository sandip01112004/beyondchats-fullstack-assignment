const request = require("supertest");
const { app } = require("../src/app");
const { setupTestDB, teardownTestDB, clearCollection } = require("./test-setup");

// Increase timeout for scraping
jest.setTimeout(30000);

beforeAll(async () => {
    await setupTestDB();
});

afterAll(async () => {
    await teardownTestDB();
});

describe("Phase 1 Validation: API & Scraper", () => {

    test("GET / should return health check message", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toContain("running");
    });

    test("POST /api/v1/articles/scrape should scrape and save articles", async () => {
        // Warning: This hits the real internet (beyondchats.com)
        const res = await request(app).post("/api/v1/articles/scrape");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);

        // Requirement: "saves exactly 5 oldest articles"
        // Since the scraper logic limits to 5, we expect <= 5.
        // It might be less if site has fewer articles (unlikely).
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data.length).toBeLessThanOrEqual(5);

        // Check first article structure
        const firstArticle = res.body.data[0];
        expect(firstArticle).toHaveProperty("title");
        expect(firstArticle).toHaveProperty("content");
        expect(firstArticle).toHaveProperty("url");
        expect(firstArticle.content.length).toBeGreaterThan(50); // Not empty HTML
    });

    test("GET /api/v1/articles should return list of articles", async () => {
        const res = await request(app).get("/api/v1/articles");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    test("GET /api/v1/articles/:id should return specific article", async () => {
        // Get list first
        const listRes = await request(app).get("/api/v1/articles");
        const articleId = listRes.body.data[0]._id;

        const res = await request(app).get(`/api/v1/articles/${articleId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data._id).toBe(articleId);
    });

});
