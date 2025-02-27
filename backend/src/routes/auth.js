const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const sendEmail = require("../utils/sendEmail"); // Import helper nodemailer

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
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phones: newUser.phones, // tambahkan field ini
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
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phones: user.phones,
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
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    let isNewUser = false; // Flag untuk cek apakah user baru

    if (!user) {
      // User baru
      isNewUser = true;
      const defaultPassword = await bcrypt.hash("defaultGooglePassword", 10);
      user = new User({
        name,
        email,
        password: defaultPassword,
        avatar: picture,
        isVerified: true, // langsung verified karena login via Google
        role: "user",
      });
      await user.save();

      // Kirim email selamat datang (hanya user baru)
      const welcomeMessage = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://www.joki-dins.my.id/images/dinsy.jpg" alt="JokiDins Logo" style="max-width: 150px; height: auto;">
  </div>
  
  <h2 style="color: #4a154b; text-align: center;">Selamat Datang di JokiDins, ${name}! 🎉</h2>
  
  <p style="font-size: 16px; line-height: 1.5; color: #333;">Halo ${name},</p>
  
  <p style="font-size: 16px; line-height: 1.5; color: #333;">Terima kasih telah bergabung dengan <strong>JokiDins</strong> melalui Google! Kami sangat senang Anda menjadi bagian dari komunitas kami.</p>
  
  <p style="font-size: 16px; line-height: 1.5; color: #333;">JokiDins hadir untuk membantu Anda menyelesaikan berbagai tugas dan proyek dengan hasil terbaik dan tepat waktu. Tim ahli kami siap membantu Anda dengan:</p>
  
  <ul style="font-size: 16px; line-height: 1.5; color: #333;">
    <li>Tugas pemrograman dan coding</li>
    <li>Proyek desain UI/UX</li>
    <li>Assignment dan paper akademik</li>
    <li>Dan berbagai layanan lainnya</li>
  </ul>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="https://joki-dins.my.id" style="background-color: #4a154b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">KUNJUNGI WEBSITE KAMI</a>
  </div>
  
  <p style="font-size: 16px; line-height: 1.5; color: #333;">Silakan kunjungi website kami di <a href="https://joki-dins.my.id" style="color: #4a154b; text-decoration: underline;">https://joki-dins.my.id</a> untuk menjelajahi layanan lengkap kami dan mendapatkan penawaran khusus untuk pengguna baru!</p>
  
  <p style="font-size: 16px; line-height: 1.5; color: #333;">Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi tim customer service kami.</p>
  
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
    <p style="font-size: 16px; color: #333;">Salam hangat,</p>
    <p style="font-size: 16px; font-weight: bold; color: #4a154b;">Ceo & Founder Ahmad Syaifuddin</p>
  </div>
</div>
`;
      await sendEmail(email, "Selamat Datang di JokiDins! 🚀", welcomeMessage);
    } else {
      // Jika user lama belum isVerified, set jadi true
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
    }

    // Generate token JWT untuk login
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        phones: user.phones,
        isNewUser, // opsional, kalau mau info ke frontend
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
