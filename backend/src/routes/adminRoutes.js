// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { disableUser, enableUser } = require("../controllers/adminController");

// Hanya admin yang bisa akses endpoint ini
router.post("/users/:id/disable", protect, admin, disableUser);
router.post("/users/:id/enable", protect, admin, enableUser);

module.exports = router;
