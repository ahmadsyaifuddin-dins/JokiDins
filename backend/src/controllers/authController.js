// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const getWelcomeMessage = require("../utils/welcomeMessage");
const { generateVerificationCode, getVerificationCodeExpires } = require("../utils/verification");
const Activity = require("../models/Activity");

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

    const verificationEmailMessage = `
      <p>Halo ${name},</p>
      <p>Terima kasih telah mendaftar di JokiDins. Berikut adalah kode verifikasi email Anda:</p>
      <h2>${verificationCode}</h2>
      <p>Masukkan kode tersebut pada halaman verifikasi untuk mengaktifkan akun Anda.</p>
      <p>Kode verifikasi ini akan berlaku selama ${VERIFICATION_CODE_EXPIRATION} menit.</p>
    `;
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30m" });
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

    const verificationEmailMessage = `
      <p>Halo ${user.name},</p>
      <p>Berikut adalah kode verifikasi email baru Anda:</p>
      <h2>${verificationCode}</h2>
      <p>Masukkan kode tersebut pada halaman verifikasi untuk mengaktifkan akun Anda.</p>
      <p>Kode verifikasi ini akan berlaku selama ${VERIFICATION_CODE_EXPIRATION} menit.</p>
    `;
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

    // Pengecekan akun aktif
    if (!user.is_active) {
      return res.status(403).json({ message: "Akun dinonaktifkan. Hubungi Developer." });
    }

    if (!user.isVerified) {
      const verificationCode = generateVerificationCode();
      const verificationCodeExpires = getVerificationCodeExpires(VERIFICATION_CODE_EXPIRATION);
      user.verificationCode = verificationCode;
      user.verificationCodeExpires = verificationCodeExpires;
      await user.save();

      const verificationEmailMessage = `
        <p>Halo ${user.name},</p>
        <p>Anda belum memverifikasi akun Anda. Berikut adalah kode verifikasi email baru:</p>
        <h2>${verificationCode}</h2>
        <p>Masukkan kode tersebut pada halaman verifikasi untuk mengaktifkan akun Anda.</p>
        <p>Kode verifikasi ini akan berlaku selama ${VERIFICATION_CODE_EXPIRATION} menit.</p>
      `;
      await sendEmail(email, "Kode Verifikasi Email", verificationEmailMessage);
      return res.status(401).json({
        message: "Akun belum terverifikasi. Kode verifikasi baru telah dikirim ke email Anda.",
        verificationRequired: true,
        email: user.email,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30m" });
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
      },
    });

    await Activity.create({
      user: user._id,
      description: "User berhasil login"
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
      return res.status(200).json({ message: "Jika email tersebut terdaftar, Anda akan menerima instruksi reset password." });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // Hash token sebelum disimpan (untuk keamanan)
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    // Set token berlaku selama 1 jam
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // Buat URL reset password (pastikan CLIENT_URL sudah diset di environment)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    // Gunakan email template untuk reset password
    const resetEmailMessage = `
      <p>Halo ${user.name},</p>
      <p>Kami menerima permintaan untuk mereset password akun Anda.</p>
      <p>Silakan klik link berikut untuk mengatur ulang password Anda:</p>
      <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
      <p>Link ini akan kadaluwarsa dalam 1 jam.</p>
      <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
    `;
    await sendEmail(user.email, "Reset Password Instructions", resetEmailMessage);

    res.status(200).json({ message: "Jika email tersebut terdaftar, Anda akan menerima instruksi reset password." });
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
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: "Token reset password tidak valid atau sudah kadaluwarsa." });
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
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(404).json({ message: "Token tidak valid atau sudah kadaluwarsa." });
    }
     // Pengecekan akun aktif
    //  if (!user.is_active) {
    //   return res.status(403).json({ message: "Akun dinonaktifkan. Hubungi Developer." });
    // }
    res.status(200).json({ message: "Token valid." });
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
    const googleId = payload.sub; // Ambil googleId dari payload

    let user = await User.findOne({ email });
    let isNewUser = false;
    
    // Jika user ditemukan, cek status aktifnya
    if (user) {
      // Cek apakah akun aktif
      if (!user.is_active) {
        return res.status(403).json({ message: "Akun dinonaktifkan. Hubungi admin." });
      }
    }

    // Jika user belum ada, buat akun baru (secara default akun baru aktif)
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
        // Pastikan akun baru otomatis aktif (default true)
        is_active: true,
      });
      await user.save();

      const welcomeMessage = getWelcomeMessage(name);
      await sendEmail(email, "Selamat Datang di JokiDins! 🚀", welcomeMessage);
    } else {
      await Activity.create({
        user: user._id,
        description: "User berhasil login dengan Google"
      });
      if (!user.isVerified) {
        user.isVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save();
      }
    }
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30m" });
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
      },
    });
    await Activity.create({
      user: user._id,
      description: "User berhasil login dengan Google"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};