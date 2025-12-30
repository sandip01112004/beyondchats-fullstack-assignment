import React, { useState, useEffect } from 'react';
import { fetchArticles } from '../api/articles';
import ArticleCard from '../components/ArticleCard';

const Dashboard = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadArticles = async () => {
            try {
                const data = await fetchArticles();
                setArticles(Array.isArray(data) ? data : []);
            } catch (err) {
                setError("Failed to load articles.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadArticles();
    }, []);

    if (loading) return <div className="loading">Loading articles...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Your Articles</h1>
                <button className="btn-primary" onClick={() => window.location.reload()}>Refresh</button>
            </div>

            {articles.length === 0 ? (
                <p className="empty-state">No articles found. Run the scraper backend to populate data.</p>
            ) : (
                <div className="articles-grid">
                    {articles.map((article) => (
                        <ArticleCard key={article._id} article={article} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
