const Activity = require("../models/Activity");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Mengambil semua user (admin only)
const getUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Akses terlarang' });
    }
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan detail user berdasarkan ID (admin only)
const getUserDetail = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Akses terlarang' });
    }
    const user = await User.findById(req.params.id).select(
      "-password -resetPasswordToken -resetPasswordExpires -verificationCode -verificationCodeExpires"
    );
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Menghapus user (admin only)
const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Akses terlarang' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    // Cegah admin menghapus akun sendiri
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({ message: "Admin tidak dapat menghapus akun sendiri" });
    }
    await user.deleteOne();
    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Mengambil profile user yang sedang login
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mengupdate profile user
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      // Simpan data sebelumnya sebelum di-update
      const previousData = {
        name: user.name,
        birthday: user.birthday,
        gender: user.gender,
        phones: user.phones
      };

      // Update data user
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.phones) {
        user.phones = req.body.phones; // expect an array
      }
      user.birthday = req.body.birthday || user.birthday;
      user.gender = req.body.gender || user.gender;

      if (req.body.password && req.body.password.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }
      
      const updatedUser = await user.save();
      
      // Kirim response terlebih dahulu
      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phones: updatedUser.phones,
        birthday: updatedUser.birthday,
        gender: updatedUser.gender,
        role: updatedUser.role,
      });
      
      // Setelah response terkirim, log aktivitas di background
      let changes = [];
      if (previousData.name !== updatedUser.name) changes.push("mengganti nama");
      if (
        previousData.birthday?.toISOString() !== 
        updatedUser.birthday?.toISOString()
      )
        changes.push("memperbarui tanggal lahir");
      if (previousData.gender !== updatedUser.gender)
        changes.push("menyetel jenis kelamin");
      if (
        JSON.stringify(previousData.phones) !== JSON.stringify(updatedUser.phones)
      )
        changes.push("mengubah nomor HP");
      if (req.body.password && req.body.password.trim() !== "")
        changes.push("mengganti password");
      
      const description =
        changes.length > 0
          ? `User ${changes.join(", ")}`
          : "User mengupdate profil";
      
      Activity.create({
        user: updatedUser._id,
        description
      }).catch(err =>
        console.error("Error logging update profile:", err)
      );
      
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Mengambil nomor telepon dari user yang sedang login
const getPhones = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.phones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserDetail,
  deleteUser,
  getProfile,
  updateProfile,
  getPhones,
};
