const { Router } = require("express");
const articleController = require("../controllers/article.controller");

const router = Router();

router.route("/")
    .get(articleController.getArticles)
    .post(articleController.createArticle);

router.route("/scrape")
    .post(articleController.scrapeArticles);

router.route("/reset")
    .delete(articleController.resetArticles);

router.route("/:id")
    .get(articleController.getArticle)
    .patch(articleController.updateArticle)
    .delete(articleController.deleteArticle);

module.exports = router;
