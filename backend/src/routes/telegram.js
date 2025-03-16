// routes/telegram.js (atau endpoint terpisah)
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

router.post("/regenerate-token", protect, async (req, res) => {
  try {
    const token = uuidv4(); // generate token baru
    // Simpan token ke user yang sedang login
    req.user.telegramToken = token;
    await req.user.save();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
