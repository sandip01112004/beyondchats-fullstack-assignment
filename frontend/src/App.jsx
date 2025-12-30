import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { useState, useEffect } from 'react';
import { fetchArticles } from './api/articles';

function Dashboard() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles()
      .then(data => {
        console.log("API Validation - Articles:", data);
        setArticles(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("API Validation Failed:", err));
  }, []);

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p>Welcome to the AI Content Agent</p>
      <p>API Status: {articles.length > 0 ? `Loaded ${articles.length} articles` : "Loading/Empty"}</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="logo">BeyondChats AI Agent</div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
