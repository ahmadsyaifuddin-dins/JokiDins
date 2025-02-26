const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

// GET Profile (Protected)
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

// GET saved phone numbers dari profil user (GET /api/user/phones)
router.get('/phones', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    res.json(user.phones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// UPDATE Profile (Protected)
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.phones) {
        user.phones = req.body.phones; // expect an array
      }
      if (req.body.password && req.body.password.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }
      const updatedUser = await user.save();
      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phones: updatedUser.phones,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
