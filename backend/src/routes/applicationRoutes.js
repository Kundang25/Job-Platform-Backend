const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  applyJob,
  getApplications
} = require("../controllers/applicationController");

router.post("/apply/:jobId", authMiddleware, applyJob);
router.get("/", authMiddleware, getApplications);

module.exports = router;