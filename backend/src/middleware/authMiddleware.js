const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User tidak ditemukan" });
      }
      // Cek apakah user sedang disuspend
      if (user.suspendedUntil && new Date() < user.suspendedUntil) {
        return res.status(403).json({ 
          message: `Akun disuspend hingga ${user.suspendedUntil.toLocaleString()}. Hubungi admin untuk info lebih lanjut.` 
        });
      }
      // Cek apakah user diblokir
      if (user.isBlocked) {
        return res.status(403).json({ message: "Akun Anda telah diblokir 😈" });
      }
      // Opsional: kalau suspendedUntil sudah lewat, aktifkan kembali akun
      if (user.suspendedUntil && new Date() >= user.suspendedUntil) {
        user.is_active = true;
        user.suspendedUntil = null;
        await user.save();
      }
      
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  
  if (!token) {
    return res.status(401).json({ message: "Dilarang liat cuy, no token no data 🤪" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };
