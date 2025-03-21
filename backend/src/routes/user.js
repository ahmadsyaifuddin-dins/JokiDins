const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

router.get('/users', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Akses terlarang' });
    }
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET detail user (Protected, hanya admin yang dapat mengakses)
router.get('/users/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Akses terlarang' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/users/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Akses terlarang' });
    }
    
    // Cari user yang akan dihapus
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    
    // Cegah admin menghapus akun sendiri (opsional)
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({ message: "Admin tidak dapat menghapus akun sendiri" });
    }
    
    // Gunakan deleteOne() atau findByIdAndDelete() daripada remove()
    await user.deleteOne(); // atau: await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: error.message });
  }
});


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
      // Tambahan update untuk birthday dan gender
      user.birthday = req.body.birthday || user.birthday;
      user.gender = req.body.gender || user.gender;
      
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
        birthday: updatedUser.birthday,
        gender: updatedUser.gender,
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
