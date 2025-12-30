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
