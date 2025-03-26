// controllers/adminController.js
const User = require("../models/User");

exports.disableUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }
    // Cegah admin mengnonaktifkan akun sendiri
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({ message: "Admin tidak dapat mengnonaktifkan akun sendiri" });
    }
    user.is_active = false;
    await user.save();

    // Opsional: tambahkan logging aktivitas admin
    console.log(`Admin ${req.user._id} menonaktifkan user ${userId} pada ${new Date().toISOString()}`);

    res.json({ message: "User dinonaktifkan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.enableUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }
    user.is_active = true;
    await user.save();

    // Opsional: tambahkan logging aktivitas admin
    console.log(`Admin ${req.user._id} mengaktifkan user ${userId} pada ${new Date().toISOString()}`);

    res.json({ message: "User diaktifkan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
