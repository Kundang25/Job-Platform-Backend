const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createProfile,
  getProfile,
  updateProfile
} = require("../controllers/profileController");

router.post("/", authMiddleware, createProfile);
router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);

module.exports = router;