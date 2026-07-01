const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { generateInsights } = require("../controllers/aiController");

router.post("/insights", authMiddleware, generateInsights);

module.exports = router;