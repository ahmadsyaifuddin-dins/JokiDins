// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { getUserDetail } = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);
router.post("/login", authController.login);
router.post("/google", authController.googleLogin);

// Endpoint detail user untuk admin
router.get("/users/:id", protect, admin, getUserDetail);

// Endpoint lupa password
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.get("/verify-reset-token/:token", authController.verifyResetToken);

module.exports = router;
