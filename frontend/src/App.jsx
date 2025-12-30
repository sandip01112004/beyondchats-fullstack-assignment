import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ArticleDetail from './pages/ArticleDetail';

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
            <Route path="/articles/:id" element={<ArticleDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
