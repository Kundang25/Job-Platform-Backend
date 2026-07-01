const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllJobs,
  getSingleJob,
  saveJob,
  getSavedJobs
} = require("../controllers/jobsController");

router.get("/", getAllJobs);
router.get("/:id", getSingleJob);

router.post("/save/:jobId", authMiddleware, saveJob);
router.get("/saved/all", authMiddleware, getSavedJobs);

module.exports = router;