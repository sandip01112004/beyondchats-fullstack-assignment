import React, { useState, useEffect } from 'react';
import { fetchArticles, scrapeArticles, startAgent, resetArticles } from '../api/articles';
import ArticleCard from '../components/ArticleCard';

const Dashboard = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionStatus, setActionStatus] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const loadArticles = async () => {
        try {
            setLoading(true);
            const data = await fetchArticles();
            setArticles(Array.isArray(data) ? data : []);
        } catch (err) {
            setError("Failed to load articles.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArticles();
    }, []);

    const handleScrape = async () => {
        if (actionLoading) return;
        try {
            setActionLoading(true);
            setActionStatus("Starting scraper... this may take a moment.");

            await scrapeArticles();

            setActionStatus("Scraping initiated successfully! Refreshing list...");
            // Initial wait for some data, then reload
            setTimeout(() => {
                loadArticles();
                setActionLoading(false);
            }, 2000);
        } catch (err) {
            setActionStatus("Failed to start scraper.");
            setActionLoading(false);
        }
    };

    const handleRunAgent = async () => {
        if (actionLoading) return;

        // UX Guard: Check if there are any scraped articles to process
        const hasScraped = articles.some(a => a.status === 'scraped');
        if (!hasScraped) {
            setActionStatus("No 'scraped' articles found to process. Please scrape first.");
            return;
        }

        try {
            setActionLoading(true);
            setActionStatus("AI Agent started... putting articles in queue.");

            await startAgent();

            setActionStatus("Agent is running! Check back shortly for rewrites.");
            setTimeout(() => {
                loadArticles();
                setActionLoading(false);
            }, 2000);
        } catch (err) {
            setActionStatus("Failed to start AI Agent.");
            setActionLoading(false);
        }
    };

    const handleReset = async () => {
        if (actionLoading) return;
        if (!window.confirm("Are you sure you want to delete ALL articles? This is for testing only.")) return;

        try {
            setActionLoading(true);
            setActionStatus("Resetting database...");
            await resetArticles();
            setArticles([]);
            setActionStatus("Database reset complete.");
            setActionLoading(false);
        } catch (err) {
            setActionStatus("Failed to reset database.");
            setActionLoading(false);
        }
    };

    if (loading && !articles.length) return <div className="loading">Loading articles...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="header-left">
                    <h1>Your Articles</h1>
                    {actionStatus && <span className="action-status">{actionStatus}</span>}
                </div>
                <div className="header-actions">
                    <button
                        className="btn-secondary"
                        onClick={handleReset}
                        disabled={actionLoading}
                        style={{ marginRight: '10px', borderColor: '#ef4444', color: '#ef4444' }}
                    >
                        Reset DB
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={handleScrape}
                        disabled={actionLoading}
                        style={{ marginRight: '10px' }}
                    >
                        {actionLoading ? 'Processing...' : 'Scrape Articles'}
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleRunAgent}
                        disabled={actionLoading || !articles.some(a => a.status === 'scraped')}
                        title={!articles.some(a => a.status === 'scraped') ? "Scrape articles first" : "Run AI Agent"}
                    >
                        {actionLoading ? 'Processing...' : 'Run AI Agent'}
                    </button>
                </div>
            </div>

            {articles.length === 0 ? (
                <p className="empty-state">No articles found. Use the buttons above to fetch data.</p>
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
