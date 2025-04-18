// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const getWelcomeMessage = require("../messages/welcomeMessage");
const { getVerificationMessage } = require("../messages/verificationMessage");
const { getResendVerificationMessage } = require("../messages/resendVerificationMessage");
const { getUnverifiedLoginMessage } = require("../messages/unverifiedLoginMessage");
const { getResetPasswordMessage } = require("../messages/resetPasswordMessage");
const validator = require("validator");
const bannedEmails = require("../utils/bannedEmails");
const bannedDomains = require("../utils/bannedDomains");

const {
  generateVerificationCode,
  getVerificationCodeExpires,
} = require("../utils/verification");
const Activity = require("../models/Activity");

const VERIFICATION_CODE_EXPIRATION = 2; // dalam menit
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Di dalam controller register
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Ubah email jadi lowercase untuk konsistensi
  const normalizedEmail = email.toLowerCase();

  // Cek apakah email sudah ada di bannedEmails
  if (bannedEmails.includes(normalizedEmail)) {
    return res.status(400).json({ message: "Email tidak valid. Gunakan email yang berbeda." });
  }

  // Cek format email dengan validator
  if (!validator.isEmail(normalizedEmail)) {
    return res.status(400).json({ message: "Format email tidak valid." });
  }

  // Ambil domain dari email dan cek apakah termasuk dalam bannedDomains
  const emailDomain = normalizedEmail.split("@")[1];
  if (bannedDomains.includes(emailDomain)) {
    return res.status(400).json({ message: "Domain email tidak diperbolehkan." });
  }

  // Lanjutkan validasi dan proses registrasi seperti biasa...
  try {
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User sudah terdaftar." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = getVerificationCodeExpires(VERIFICATION_CODE_EXPIRATION);

    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: role && role === "admin" ? "admin" : "user",
      isVerified: false,
      verificationCode,
      verificationCodeExpires,
      deviceInfo: req.useragent, // bisa langsung pass object req.useragent jika format sudah sesuai
    });
    await newUser.save();

    const verificationEmailMessage = getVerificationMessage(name, verificationCode, VERIFICATION_CODE_EXPIRATION);
    await sendEmail(normalizedEmail, "Kode Verifikasi Email", verificationEmailMessage);

    res.status(201).json({
      message: "Registrasi berhasil! Silakan periksa email Anda untuk kode verifikasi.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVerificationExpiry = async (req, res) => {
  try {
    // Return the verification code expiration time in minutes
    res.status(200).json({
      expirationMinutes: VERIFICATION_CODE_EXPIRATION,
      message: "Verification expiration time retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User tidak ditemukan." });
    if (user.isVerified)
      return res.status(400).json({ message: "Email sudah diverifikasi." });
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
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
    if (!user)
      return res.status(400).json({ message: "User tidak ditemukan." });
    if (user.isVerified)
      return res.status(400).json({ message: "Email sudah diverifikasi." });

    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = getVerificationCodeExpires(
      VERIFICATION_CODE_EXPIRATION
    );

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    const verificationEmailMessage = getResendVerificationMessage(user.name, verificationCode, VERIFICATION_CODE_EXPIRATION);
    await sendEmail(
      email,
      "Kode Verifikasi Email Baru",
      verificationEmailMessage
    );
    res
      .status(200)
      .json({ message: "Kode verifikasi baru telah dikirim ke email Anda." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const { browser, os, platform, version, ua, isMobile, isTablet } = req.useragent;
  console.log(`Login: Browser - ${browser}, OS - ${os}, Platform - ${platform}`);

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email atau password salah." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Email atau password salah." });

    // Pengecekan akun suspend
    if (user.suspendedUntil && new Date() < user.suspendedUntil) {
      return res.status(403).json({
        message: `Akun disuspend hingga ${new Date(user.suspendedUntil).toLocaleString("id-ID", { timeZone: "Asia/Makassar" })}. Hubungi Dev untuk info lebih lanjut.`,
      });
    }

    // Pengecekan akun diblokir
    if (user.isBlocked) {
      return res.status(403).json({ message: "Akun Anda telah diblokir 😈" });
    }

    if (!user.isVerified) {
      const verificationCode = generateVerificationCode();
      const verificationCodeExpires = getVerificationCodeExpires(VERIFICATION_CODE_EXPIRATION);
      user.verificationCode = verificationCode;
      user.verificationCodeExpires = verificationCodeExpires;
      await user.save();

      const verificationEmailMessage = getUnverifiedLoginMessage(user.name, verificationCode, VERIFICATION_CODE_EXPIRATION);
      await sendEmail(email, "Kode Verifikasi Email", verificationEmailMessage);
      return res.status(401).json({
        message: "Akun belum terverifikasi. Kode verifikasi baru telah dikirim ke email Anda.",
        verificationRequired: true,
        email: user.email,
      });
    }

    // Update deviceInfo setiap kali login, baik user lama maupun baru
    user.deviceInfo = { browser, version, os, platform, ua, isMobile, isTablet };
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phones: user.phones,
        birthday: user.birthday,
        gender: user.gender,
        role: user.role,
        is_active: user.is_active,
        // Flatten deviceInfo agar FE bisa akses secara langsung
        browser: user.deviceInfo?.browser,
        os: user.deviceInfo?.os,
        platform: user.deviceInfo?.platform,
        version: user.deviceInfo?.version,
        ua: user.deviceInfo?.ua,
        isMobile: user.deviceInfo?.isMobile,
        isTablet: user.deviceInfo?.isTablet,
      },
    });

    await Activity.create({
      user: user._id,
      description: "User berhasil login",
      deviceInfo: { browser, os, platform },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk lupa password: generate token reset dan kirim email
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    // Untuk keamanan, kita tetap kirim response yang sama walaupun user tidak ditemukan
    if (!user) {
      return res.status(200).json({
        message: "Jika email tersebut terdaftar, Anda akan menerima instruksi reset password.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // Hash token sebelum disimpan (untuk keamanan)
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    // Set token berlaku selama 1 jam
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // Buat URL reset password (pastikan CLIENT_URL sudah diset di environment)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    // Gunakan email template untuk reset password
    const resetEmailMessage = getResetPasswordMessage(user.name, resetUrl);
    await sendEmail(
      user.email,
      "Reset Password Instructions",
      resetEmailMessage
    );

    res.status(200).json({
      message: "Jika email tersebut terdaftar, Anda akan menerima instruksi reset password.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk reset password menggunakan token yang dikirim via email
exports.resetPassword = async (req, res) => {
  const { token } = req.params; // token dari URL
  const { newPassword } = req.body;
  try {
    // Hash token dari URL untuk dicocokkan dengan yang tersimpan
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Cari user dengan token yang cocok dan belum kadaluwarsa
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({
          message: "Token reset password tidak valid atau sudah kadaluwarsa.",
        });
    }

    // Hash new password dan update user
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    // Hapus token reset dan expiration-nya
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password berhasil direset." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyResetToken = async (req, res) => {
  const { token } = req.params;
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Token tidak valid atau sudah kadaluwarsa." });
    }
   
    res.status(200).json({ message: "Token valid." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.googleLogin = async (req, res) => {
  const { token: googleToken } = req.body;
  // Tangkap device info dari user-agent
  const { browser, os, platform, version, ua, isMobile, isTablet } = req.useragent;
  console.log(
    `Google Login: Browser - ${browser}, OS - ${os}, Platform - ${platform}`
  );

  try {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    const googleId = payload.sub; // Ambil googleId dari payload

    let user = await User.findOne({ email });
    let isNewUser = false;

    // Kalau user belum ada, buat akun baru
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
        loginMethod: "google",
        googleId: picture ? googleId : null,
        is_active: true,
        // Pastikan suspendedUntil defaultnya null sudah ditetapkan oleh schema
        deviceInfo: { browser, os, platform, version, ua, isMobile, isTablet },
      });
      await user.save();

      const welcomeMessage = getWelcomeMessage(name);
      await sendEmail(email, "Selamat Datang di JokiDins! 🚀", welcomeMessage);
    } else {
      // Kalau user sudah ada, lakukan pengecekan suspend dan blokir
      if (user.suspendedUntil && new Date() < user.suspendedUntil) {
        return res.status(403).json({
          message: `Akun disuspend hingga ${new Date(user.suspendedUntil).toLocaleString("id-ID", { timeZone: "Asia/Makassar" })}. Hubungi Dev untuk info lebih lanjut.`,
        });
      }
      if (user.isBlocked) {
        return res.status(403).json({ message: "Akun Anda telah diblokir 😈" });
      }

      // Update deviceInfo saat login via Google
      user.deviceInfo = { browser, version, os, platform, ua, isMobile, isTablet };
      await user.save();

      await Activity.create({
        user: user._id,
        description: "User berhasil login dengan Google",
      });
      if (!user.isVerified) {
        user.isVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save();
      }
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
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
        birthday: user.birthday,
        gender: user.gender,
        loginMethod: user.loginMethod,
        googleId: user.googleId,
        isNewUser,
        is_active: user.is_active,
        browser: user.deviceInfo?.browser,
        os: user.deviceInfo?.os,
        platform: user.deviceInfo?.platform,
        version: user.deviceInfo?.version,
        ua: user.deviceInfo?.ua,
        isMobile: user.deviceInfo?.isMobile,
        isTablet: user.deviceInfo?.isTablet,
      },
    });
    await Activity.create({
      user: user._id,
      description: "User berhasil login dengan Google",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};