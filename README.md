# AI Content Curator - Internship Assignment
![Status](https://img.shields.io/badge/Status-Completed-success) ![Stack](https://img.shields.io/badge/Stack-MERN-blue)

A full-stack application that automates content curation. It scrapes blog articles, rewrites them using Google Gemini AI, and presents them in a clean dashboard for review.

---

## ✅ Feature vs. Requirement Mapping

| Assignment Requirement | Implementation Detail | Status |
| :--- | :--- | :--- |
| **Web Scraper** | Robust Puppeteer/Cheerio scripts to extract content. | ✅ Completed |
| **AI Integration** | Google Gemini 2.5 Flash for high-quality rewriting. | ✅ Completed |
| **Dashboard UI** | React-based grid view with live status updates. | ✅ Completed |
| **Split View** | **Side-by-side comparison** of Original & Rewritten text. | ✅ Completed |
| **No Frameworks** | Pure CSS for all styling (no proprietary libraries). | ✅ Completed |

---

## 🚀 Reviewer Guide: How to Test

Follow these simple steps to see the entire pipeline in action:

1.  **Start Services**:
    *   Backend: `npm start` (Runs on port 8000)
    *   Frontend: `npm run dev` (Runs on port 5173)

2.  **Open Dashboard**: Navigate to [http://localhost:5173](http://localhost:5173).

3.  **Step 1: Scrape**:
    *   Click the **"Scrape Articles"** button in the header.
    *   *Result*: You will see articles appear with a `Scraped` badge.

4.  **Step 2: Rewrite**:
    *   Click the **"Run AI Agent"** button.
    *   *Result*: The status will change to `Processing` and then `Rewritten`.

5.  **Step 3: Compare**:
    *   Click on any card with a `Rewritten` badge.
    *   *Result*: You will see the **Split View** layout showing the transformation.

---

## 📖 How It Works (Simplified)

This tool automates the lifecycle of content creation:

1.  **Curate**: The system visits target blogs (e.g., BeyondChats) and reads the articles, effectively "scraping" the raw text.
2.  **Research & Think**: The AI Agent assumes a persona. It reads the scraped content, performs background research (simulated), and creates a coherent rewriting plan.
3.  **Rewrite**: Using Generative AI (Gemini), it produces a fresh, unique version of the article while maintaining the core message.
4.  **Review**: The Dashboard provides a transparent look at the process. The **Split View** is critical for humans to spot-check the AI's work against the original source.

---

## 🛠 Technical Details

### Architecture
- **Backend**: Node.js & Express.
- **Database**: MongoDB Atlas (Stores `Article` documents with `scraped` and `rewritten` content).
- **Processing**: A sequential pipeline (Scrape -> Queue -> Rewrite -> Save).
- **Frontend**: React + Vite (Fast, component-based UI).

### Project Structure
```text
/beyond-chats
  /backend
    /src        # API & Agent Logic
    /scripts    # Utility scripts (seeding, debugging)
  /frontend
    /src
      /pages    # Dashboard & ArticleDetail views
```

## ⚙️ Local Development Setup

If you need to install from scratch:

**1. Backend**
```bash
cd backend
npm install
# Ensure .env has MONGODB_URI and GEMINI_API_KEY
npm start
```

**2. Frontend**
```bash
cd frontend
npm install
npm run dev
```

---
**Author**: Sandip Kharate
**Role**: Full Stack Intern Applicant
