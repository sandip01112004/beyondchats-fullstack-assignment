const mongoose = require("mongoose");



/**
 * Article Schema Design
 * 
 * Strategy:
 * 1. Single Collection: We use a single 'articles' collection for both scraped originals and AI-rewritten versions.
 * 2. Self-Referencing: The `originalArticleId` field links a rewritten article back to its source.
 * 3. Extensibility: 'metadata' field allows storing unstructured data (Google rank, search terms) without breaking schema.
 */
const articleSchema = new mongoose.Schema(
    {
        // Core Content
        title: {
            type: String,
            required: true,
            trim: true,
            index: true, // indexed for search in Phase 2
        },
        content: {
            type: String,
            required: true, // HTML or Markdown content
        },
        url: {
            type: String,
            required: true,
            unique: true, // Prevent duplicate scraping
        },

        // Metadata for sorting/display
        publicationDate: {
            type: Date,
            default: Date.now,
        },
        author: {
            type: String,
            default: "BeyondChats",
        },

        // Workflow Status (Supports Phase 3 Dashboard)
        status: {
            type: String,
            enum: ["scraped", "processing", "rewritten", "failed"],
            default: "scraped",
            index: true,
        },

        // Phase 2: Relationship w/ Original
        // If this is an AI rewrite, this points to the parent article
        originalArticleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Article",
            default: null,
            index: true,
        },

        // Phase 2: Citations
        // Stores the "Top 2 ranking blog articles" found via Google
        references: [{
            title: String,
            url: String,
            snippet: String, // Store a brief excerpt if needed
        }],

        // Future Proofing / Debugging
        metadata: {
            searchQuery: String, // What we searched on Google to find references
            processingTimeMs: Number,
            modelUsed: String,   // e.g., "gemini-pro"
        }
    },
    {
        timestamps: true, // createdAt, updatedAt
    }
);

const Article = mongoose.model("Article", articleSchema);

module.exports = { Article };
