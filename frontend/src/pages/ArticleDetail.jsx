import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchArticleById } from '../api/articles';

import './ArticleDetail.css';

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [originalArticle, setOriginalArticle] = useState(null);
    const [rewrittenArticle, setRewrittenArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // 1. Fetch the requested article
                const mainArticle = await fetchArticleById(id);

                if (mainArticle.status === 'rewritten') {
                    setRewrittenArticle(mainArticle);
                    if (mainArticle.originalArticleId) {
                        // Fetch original if linked
                        try {
                            const original = await fetchArticleById(mainArticle.originalArticleId);
                            setOriginalArticle(original);
                        } catch (err) {
                            console.warn("Could not fetch original article linked:", err);
                        }
                    }
                } else {
                    // It's likely the original or processing
                    setOriginalArticle(mainArticle);
                    // In a real app, we might query for the rewritten version here if we wanted
                    // For now, we'll just show what we have.
                }

            } catch (err) {
                setError("Failed to load article details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) return <div className="loading">Loading details...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="detail-container">
            <button className="back-btn" onClick={() => navigate('/')}>&larr; Back to Dashboard</button>

            <div className="comparison-layout">
                {/* Left Column: Original */}
                <div className="article-column original-col">
                    <h2>Original Article</h2>
                    {originalArticle ? (
                        <div className="article-content">
                            <h3>{originalArticle.title}</h3>
                            <div className="meta">
                                <span className="badge-neutral">{originalArticle.status}</span>
                                <span>{originalArticle.url}</span>
                            </div>
                            <div className="body-text" dangerouslySetInnerHTML={{ __html: originalArticle.content }} />
                        </div>
                    ) : (
                        <p className="placeholder-text">Original content not available.</p>
                    )}
                </div>

                {/* Right Column: Rewritten */}
                <div className="article-column rewritten-col">
                    <h2>AI Rewritten Article</h2>
                    {rewrittenArticle ? (
                        <div className="article-content">
                            <h3>{rewrittenArticle.title}</h3>
                            <div className="meta">
                                <span className="badge-success">rewritten</span>
                            </div>
                            {/* Rendering Markdown as HTML for simplicity, though usually needs a parser */}
                            <div className="body-text" style={{ whiteSpace: 'pre-wrap' }}>
                                {rewrittenArticle.content}
                            </div>
                        </div>
                    ) : (
                        <div className="empty-rewritten">
                            <p>No rewritten content yet.</p>
                            {originalArticle && originalArticle.status === 'scraped' && (
                                <p><em>This article has not been processed by the AI Agent yet.</em></p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;
