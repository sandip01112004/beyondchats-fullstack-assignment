import React from 'react';
import { useNavigate } from 'react-router-dom';

const ArticleCard = ({ article }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/articles/${article._id}`);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'rewritten': return 'badge-success';
            case 'processing': return 'badge-warning';
            case 'failed': return 'badge-error';
            default: return 'badge-neutral';
        }
    };

    return (
        <div className="article-card" onClick={handleCardClick}>
            <h3 className="article-title">{article.title}</h3>
            <div className="card-footer">
                <span className={`status-badge ${getStatusClass(article.status)}`}>
                    {article.status || 'original'}
                </span>
                <span className="date">
                    {new Date(article.createdAt).toLocaleDateString()}
                </span>
            </div>
        </div>
    );
};

export default ArticleCard;
