// controllers/userController.js
const User = require("../models/User");

const getUserById = async (req, res) => {
  try {
    // Buang field sensitif supaya aman
    const user = await User.findById(req.params.id).select(
      "-password -resetPasswordToken -resetPasswordExpires -verificationCode -verificationCodeExpires"
    );
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserById };
