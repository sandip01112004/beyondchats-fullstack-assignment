const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

// Global Middleware
app.use(cors({
    origin: "*"
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Routes Import
const articleRouter = require("./routes/article.routes");
const agentRouter = require("./routes/agent.routes");

// Routes Declaration
app.use("/api/v1/articles", articleRouter);
app.use("/api/v1/agent", agentRouter);

// Base route
app.get("/", (req, res) => {
    res.json({ message: "BeyondChats Internship Assignment API is running" });
});

// Error Handler
app.use(errorHandler);

module.exports = { app };
