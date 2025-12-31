const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");
const articleService = require("../services/article.service");
const scraperService = require("../services/scraper.service");

// Helper to wrap async controller logic
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

const getArticles = catchAsync(async (req, res) => {
    const articles = await articleService.queryArticles({});
    res.status(200).json(new ApiResponse(200, articles, "Articles fetched successfully"));
});

const getArticle = catchAsync(async (req, res) => {
    const article = await articleService.getArticleById(req.params.id);
    if (!article) {
        throw new ApiError(404, "Article not found");
    }
    res.status(200).json(new ApiResponse(200, article, "Article fetched successfully"));
});

const createArticle = catchAsync(async (req, res) => {
    const { title, content, url } = req.body;
    if (!title || !url) {
        throw new ApiError(400, "Title and URL are required");
    }

    // Check if exists
    const existing = await articleService.queryArticles({ url });
    if (existing.length > 0) {
        throw new ApiError(409, "Article with this URL already exists");
    }

    const article = await articleService.createArticle(req.body);
    res.status(201).json(new ApiResponse(201, article, "Article created successfully"));
});

const updateArticle = catchAsync(async (req, res) => {
    const article = await articleService.updateArticleById(req.params.id, req.body);
    if (!article) {
        throw new ApiError(404, "Article not found");
    }
    res.status(200).json(new ApiResponse(200, article, "Article updated successfully"));
});

const deleteArticle = catchAsync(async (req, res) => {
    const article = await articleService.deleteArticleById(req.params.id);
    if (!article) {
        throw new ApiError(404, "Article not found");
    }
    res.status(204).send(); // 204 No Content
});

const scrapeArticles = catchAsync(async (req, res) => {
    // 1. Scrape
    const scrapedData = await scraperService.getOldestArticles(5);

    // 2. Save to DB
    const savedArticles = [];
    for (const data of scrapedData) {
        const existing = await articleService.queryArticles({ url: data.url });
        if (existing.length === 0) {
            const saved = await articleService.createArticle(data);
            savedArticles.push(saved);
        }
    }

    res.status(200).json(new ApiResponse(200, savedArticles, `Scraped ${scrapedData.length} articles, saved ${savedArticles.length} new ones.`));
});

const resetArticles = catchAsync(async (req, res) => {
    const deletedCount = await articleService.deleteAllArticles();
    res.status(200).json(new ApiResponse(200, { deletedCount }, "All articles deleted successfully"));
});

module.exports = {
    getArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    scrapeArticles,
    resetArticles
};
