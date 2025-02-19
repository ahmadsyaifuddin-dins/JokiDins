const express = require("express");
const User = require("../models/User");

const router = express.Router();

// API untuk daftar user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User berhasil didaftarkan" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API untuk cek daftar user
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
