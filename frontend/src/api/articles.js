import api from './axios';

/**
 * Fetch all articles
 * @returns {Promise<Array>} List of articles
 */
export const fetchArticles = async () => {
    try {
        constresponse = await api.get('/articles');
        return response.data; // Assuming backend returns { data: [...] } or [...]
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
        return response.data;
    } catch (error) {
        console.error(`Error fetching article ${id}:`, error);
        throw error;
    }
};
