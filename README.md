# AI Content Agent - Full Stack Internship Assignment

A full-stack application that scrapes blog articles, processes them using **Gemini AI** to rewrite the content, and displays the results in a clean dashboard.

## 🏗 Architecture

The system consists of two main components:

1.  **Backend (Node.js/Express)**
    *   **Scraper Service**: Uses Puppeteer to extract content from URLs.
    *   **Search Service**: Finds competitor articles for context.
    *   **AI Service**: Integreates Google Gemini 2.5 Flash to rewrite articles.
    *   **Agent Service**: Orchestrates the fetch -> scrape -> rewrite pipeline.
    *   **Database**: MongoDB Atlas for persistence.

2.  **Frontend (React/Vite)**
    *   **Dashboard**: Overview of articles with live status badges.
    *   **Detail View**: Split-screen comparison of Original vs Rewritten content.
    *   **Tech**: React 19, Axios, Pure CSS (Responsive).

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI
- Gemini API Key

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env with MONGODB_URI and GEMINI_API_KEY
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# API base URL defaults to http://localhost:8000/api/v1
npm run dev
```

### 3. Usage
1.  Open `http://localhost:5173`.
2.  If the dashboard is empty, verify the backend is running.
3.  (Optional) Run `node backend/seed-db.js` to populate test data.
4.  Click an article to see the AI rewriting in action.

## 🛠 Features

- **Automated Workflow**: From scraping to rewriting without manual intervention.
- **Robust Error Handling**: Handles API limits, timeouts, and missing content gracefully.
- **Modern UI**: Clean, professional interface with mobile responsiveness.

## 📝 Status Indicators
- `scraped`: Content collected, waiting for AI.
- `processing`: Currently being rewritten by Gemini.
- `rewritten`: Success! AI content available.
- `failed`: Something went wrong (check logs).

---
**Author**: Sandip Kharate
**Assignment**: BeyondChats Full Stack Internship
