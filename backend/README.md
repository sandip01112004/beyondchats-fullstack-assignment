# Backend API

Production-ready Express server for the BeyondChats assignment.

## Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Gemini API Key

## Production Startup
The only command needed for production is:
```bash
npm start
```
This runs `src/server.js`, which starts the Express API and acts as the entry point for the Agent.

## Utility Scripts
**OPTIONAL:** The `scripts/` directory contains utilities for development, debugging, and seeding. These are **not** required for the main application to function.

| Script | Purpose |
|O---|---|
| `scripts/seed-db.js` | Populates the DB with dummy data (scraped & rewritten articles). |
| `scripts/check-db.js` | Lists all articles in the DB to verify content. |
| `scripts/run-agent.js` | Manually triggers the AI agent loop (CLI version). |
| `scripts/debug-db.js` | Diagnoses MongoDB connection issues. |
| `scripts/debug-models.js`| Tests the Gemini API connection. |

To run a script:
```bash
node scripts/seed-db.js
```
