import api from './axios';

/**
 * Fetch all articles
 * @returns {Promise<Array>} List of articles
 */
export const fetchArticles = async () => {
    try {
        const response = await api.get('/articles');
        return response.data.data; // Wraps { statusCode, data, message }
    } catch (error) {
        console.error("Error fetching articles:", error);
        throw error;
    }
};

/**
 * Fetch a single article by ID
 * @param {string} id 
 * @returns {Promise<Object>} Article details
 */
export const fetchArticleById = async (id) => {
    try {
        const response = await api.get(`/articles/${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching article ${id}:`, error);
        throw error;
    }
};

/**
 * Trigger the scraper to run (Phase 1)
 */
export const scrapeArticles = async () => {
    try {
        const response = await api.post('/articles/scrape');
        return response.data;
    } catch (error) {
        console.error("Error triggering scraper:", error);
        throw error;
    }
};

/**
 * Trigger the AI Agent (Phase 2)
 */
export const startAgent = async () => {
    try {
        const response = await api.post('/agent/start');
        return response.data;
    } catch (error) {
        console.error("Error starting AI agent:", error);
        throw error;
    }
};

/**
 * Trigger the API to reset all articles
 */
export const resetArticles = async () => {
    try {
        const response = await api.delete('/articles/reset');
        return response.data;
    } catch (error) {
        console.error("Error resetting articles:", error);
        throw error;
    }
};
