const { ApiResponse } = require("../utils/ApiResponse");
const agentService = require("../services/agent.service");

const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

const startAgent = catchAsync(async (req, res) => {
    // Determine if we should process one or all? 
    // The script processes one "next" article. The UI says "Run AI Agent", implying it starts the process.
    // If we want to process ALL, we'd need a loop. 
    // But usually APIs should be short-lived. 
    // Let's call processNextArticle. If the user wants to process multiple, they can click again or we loop in service.
    // However, for the assignment simplicity, let's just run processNextArticle once per request.

    // Better yet, let's check if the service returns something meaningful.
    const result = await agentService.processNextArticle();

    if (!result) {
        return res.status(200).json(new ApiResponse(200, null, "No pending articles found to process."));
    }

    res.status(200).json(new ApiResponse(200, result, "Agent successfully processed an article."));
});

module.exports = {
    startAgent
};
