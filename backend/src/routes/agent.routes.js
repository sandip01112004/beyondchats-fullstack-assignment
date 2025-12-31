const { Router } = require("express");
const agentController = require("../controllers/agent.controller");

const router = Router();

router.route("/start").post(agentController.startAgent);

module.exports = router;
