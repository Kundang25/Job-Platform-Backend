const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  resumeScore,
  skillGapAnalysis,
  generateCoverLetter,
  interviewPrep
} = require("../controllers/advancedAIController");

router.post("/resume-score", authMiddleware, resumeScore);
router.post("/skill-gap", authMiddleware, skillGapAnalysis);
router.post("/cover-letter", authMiddleware, generateCoverLetter);
router.post("/interview-prep", authMiddleware, interviewPrep);

module.exports = router;