const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getUsers,
  getUserDetail,
  deleteUser,
  getProfile,
  updateProfile,
  getPhones,
  status,
} = require("../controllers/userController");

// Hanya admin yang bisa akses data user
router.get('/users', protect, getUsers);

// Hanya admin yang bisa lihat detail user
router.get('/users/:id', protect, getUserDetail);

// Hanya admin yang bisa hapus user
router.delete('/users/:id', protect, deleteUser);

// Ambil data profile (untuk user yang sedang login)
router.get("/profile", protect, getProfile);

// Update profile
router.put("/profile", protect, updateProfile);

// Ambil nomor telepon dari profile user
router.get('/phones', protect, getPhones);

// Endpoint untuk cek status akun
router.get("/status", protect, status);

module.exports = router;
