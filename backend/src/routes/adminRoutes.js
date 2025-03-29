// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { disableUser, enableUser, blockUser, unblockUser } = require("../controllers/adminController");

// Hanya admin yang bisa akses endpoint ini
router.post("/users/:id/disable", protect, admin, disableUser);
router.post("/users/:id/enable", protect, admin, enableUser);

// Endpoint untuk blokir/unblokir user
router.post("/users/:id/block", protect, admin, blockUser);
router.post("/users/:id/unblock", protect, admin, unblockUser);
module.exports = router;
