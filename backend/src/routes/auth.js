const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register endpoint
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body; // tambahkan role di sini
  try {
    // Cek apakah user sudah ada
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User sudah terdaftar." });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Buat user baru
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role && role === "admin" ? "admin" : "user", // gunakan nilai role dari req.body jika ada, default "user"
    });
    await newUser.save();
    
    // Generate token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role, // sertakan role di sini
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email atau password salah." });
    }
    
    // Bandingkan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email atau password salah." });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Google Login endpoint
router.post("/google", async (req, res) => {
  const { token: googleToken } = req.body;
  try {
    // Verifikasi token Google
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Cari user berdasarkan email
    let user = await User.findOne({ email });
    if (!user) {
      // Jika belum ada, buat user baru dengan role default "user"
      // Gunakan password default yang sudah di-hash (tidak akan dipakai untuk login via Google)
      const hashedPassword = await bcrypt.hash("defaultPassword123", 10);
      user = new User({
        name,
        email,
        password: hashedPassword,
        role: "user",
      });
      await user.save();
    }
    
    // Generate JWT
    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    
    res.status(200).json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
