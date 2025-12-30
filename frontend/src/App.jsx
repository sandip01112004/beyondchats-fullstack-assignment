import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p>Welcome to the AI Content Agent</p>
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
