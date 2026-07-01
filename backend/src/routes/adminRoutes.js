const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllUsers,
  getAllJobs,
  getAnalytics,
  deleteUser,
  deleteJob,
  createJob
} = require("../controllers/adminController");

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/users", getAllUsers);
router.get("/jobs", getAllJobs);
router.get("/analytics", getAnalytics);

router.delete("/users/:id", deleteUser);
router.delete("/jobs/:id", deleteJob);

router.post("/jobs/create", createJob);

module.exports = router;