const { Article } = require("../models/Article");

const createArticle = async (articleData) => {
    return await Article.create(articleData);
};

const queryArticles = async (filter, options = {}) => {
    // Basic sorting by default: Newest first
    return await Article.find(filter).sort({ createdAt: -1 });
};

const getArticleById = async (id) => {
    return await Article.findById(id);
};

const updateArticleById = async (id, updateBody) => {
    const article = await getArticleById(id);
    if (!article) return null;

    Object.assign(article, updateBody);
    await article.save();
    return article;
};

const deleteArticleById = async (id) => {
    const article = await getArticleById(id);
    if (!article) return null;

    await article.deleteOne();
    return article;
};

module.exports = {
    createArticle,
    queryArticles,
    getArticleById,
    updateArticleById,
    deleteArticleById
};
