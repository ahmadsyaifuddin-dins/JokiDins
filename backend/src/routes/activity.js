// routes/activity.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getUserActivity } = require("../controllers/activityController");

router.get("/:id", protect, getUserActivity);

module.exports = router;
