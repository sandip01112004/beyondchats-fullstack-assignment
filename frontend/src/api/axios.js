import axios from 'axios';

const api = axios.create({
    baseURL: "https://beyondchats-fullstack-assignment-027c.onrender.com/api/v1", // Hardcoded for assignment submission as requested
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
