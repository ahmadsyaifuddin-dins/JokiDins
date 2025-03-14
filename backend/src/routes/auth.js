// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);
router.post("/login", authController.login);
router.post("/google", authController.googleLogin);

module.exports = router;
