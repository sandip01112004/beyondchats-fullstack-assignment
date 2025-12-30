const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * AI Service for rewriting articles using Google Gemini
 */
class AIService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("WARNING: GEMINI_API_KEY is not set in environment variables.");
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        // using gemini-1.5-flash for speed and efficiency
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }

    /**
     * Rewrites an article using reference texts for style and content inspiration.
     * @param {string} originalText - The original article text to rewrite.
     * @param {string[]} referenceTexts - Array of reference article texts.
     * @returns {Promise<string>} - The rewritten article in Markdown format.
     */
    async rewriteArticle(originalText, referenceTexts = []) {
        try {
            if (!originalText) {
                throw new Error("Original text is required for rewriting.");
            }

            // Construct the prompt
            let prompt = `You are a professional technical blog editor. Your task is to rewrite the following article to improve its clarity, flow, and engagement while maintaining factual accuracy.

Original Article:
${originalText}

`;

            if (referenceTexts.length > 0) {
                prompt += `Reference Styles (use these for tone and structure inspiration, but do not copy content directly):
${referenceTexts.map((text, index) => `--- Reference ${index + 1} ---\n${text}\n`).join("\n")}
`;
            }

            prompt += `
Instructions:
1. Act as a professional tech blog editor.
2. Rewrite the original article.
3. Avoid plagiarism completely. Reword and restructure.
4. Improve clarity, formatting (use Markdown), and SEO (use appropriate headings).
5. Preserve all factual information from the original text.
6. Return ONLY the rewritten article content. Do not include any introductory or concluding remarks ("Here is the rewritten article", etc.).
`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return text;
        } catch (error) {
            console.error("AI Service Error:", error);
            if (error.status === 429) {
                throw new Error("Gemini API rate limit exceeded. Please try again later.");
            } else if (error.message.includes("SAFETY")) {
                throw new Error("Content blocked by safety filters. Please review the input.");
            } else if (error.status === 404 || error.message.includes("not found")) {
                throw new Error("Gemini Model not found. Check your GEMINI_API_KEY and ensure the 'Gemini API' is enabled in your Google Cloud Console.");
            }
            throw error;
        }
    }
}

module.exports = new AIService();
