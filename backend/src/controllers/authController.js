// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const getWelcomeMessage = require("../utils/welcomeMessage");
const { generateVerificationCode, getVerificationCodeExpires } = require("../utils/verification");
const { getVerificationEmailMessage } = require("../utils/emailTemplates");

const VERIFICATION_CODE_EXPIRATION = 5; // dalam menit
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User sudah terdaftar." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = getVerificationCodeExpires(VERIFICATION_CODE_EXPIRATION);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role && role === "admin" ? "admin" : "user",
      isVerified: false,
      verificationCode,
      verificationCodeExpires,
    });
    await newUser.save();

    const verificationEmailMessage = getVerificationEmailMessage(
        user.name,
        verificationCode,
        VERIFICATION_CODE_EXPIRATION
      );
    await sendEmail(email, "Kode Verifikasi Email", verificationEmailMessage);

    res.status(201).json({
      message: "Registrasi berhasil! Silakan periksa email Anda untuk kode verifikasi.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User tidak ditemukan." });
    if (user.isVerified) return res.status(400).json({ message: "Email sudah diverifikasi." });
    if (user.verificationCode !== verificationCode)
      return res.status(400).json({ message: "Kode verifikasi salah." });
    
    if (new Date() > user.verificationCodeExpires) {
      return res.status(400).json({ 
        message: "Kode verifikasi sudah kedaluwarsa. Silakan minta kode baru.",
        expired: true,
      });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    const welcomeMessage = getWelcomeMessage(user.name);
    await sendEmail(email, "Selamat Datang di JokiDins! 🚀", welcomeMessage);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phones: user.phones,
        role: user.role,
        isVerified: user.isVerified,
      },
      message: "Email berhasil diverifikasi, selamat bergabung!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resendVerification = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User tidak ditemukan." });
    if (user.isVerified) return res.status(400).json({ message: "Email sudah diverifikasi." });

    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = getVerificationCodeExpires(VERIFICATION_CODE_EXPIRATION);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    const verificationEmailMessage = getVerificationEmailMessage(
        user.name,
        verificationCode,
        VERIFICATION_CODE_EXPIRATION
      );
    await sendEmail(email, "Kode Verifikasi Email Baru", verificationEmailMessage);
    res.status(200).json({ message: "Kode verifikasi baru telah dikirim ke email Anda." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email atau password salah." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Email atau password salah." });

    if (!user.isVerified) {
      const verificationCode = generateVerificationCode();
      const verificationCodeExpires = getVerificationCodeExpires(VERIFICATION_CODE_EXPIRATION);
      user.verificationCode = verificationCode;
      user.verificationCodeExpires = verificationCodeExpires;
      await user.save();

      const verificationEmailMessage = getVerificationEmailMessage(
        user.name,
        verificationCode,
        VERIFICATION_CODE_EXPIRATION
      );
      await sendEmail(email, "Kode Verifikasi Email", verificationEmailMessage);
      return res.status(401).json({
        message: "Akun belum terverifikasi. Kode verifikasi baru telah dikirim ke email Anda.",
        verificationRequired: true,
        email: user.email,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
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
};

exports.googleLogin = async (req, res) => {
  const { token: googleToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      const defaultPassword = await bcrypt.hash("defaultGooglePassword", 10);
      user = new User({
        name,
        email,
        password: defaultPassword,
        avatar: picture,
        isVerified: true,
        role: "user",
      });
      await user.save();

      const welcomeMessage = getWelcomeMessage(name);
      await sendEmail(email, "Selamat Datang di JokiDins! 🚀", welcomeMessage);
    } else {
      if (!user.isVerified) {
        user.isVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save();
      }
    }
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
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
        isNewUser,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
