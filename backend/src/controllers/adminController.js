const User = require("../models/User");
const { disableAccountMessage } = require("../messages/disableAccountMessage");
const { enableAccountMessage } = require("../messages/enableAccountMessage");
const { blockAccountMessage } = require("../messages/blockAccountMessage");
const { unblockAccountMessage } = require("../messages/unblockAccountMessage");
const sendEmail = require("../utils/sendEmail"); // pastikan sudah import fungsi sendEmail

exports.disableUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { duration } = req.body; // misalnya duration dalam hari
    const suspensionDuration = duration ? Number(duration) : 1; // default 1 hari

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }
    // Cegah admin mengnonaktifkan akun sendiri
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({ message: "Admin tidak dapat mengnonaktifkan akun sendiri" });
    }
    
    // Set status suspend: nonaktif dan set suspendedUntil ke waktu tertentu
    user.is_active = false;
    user.suspendedUntil = new Date(Date.now() + suspensionDuration * 24 * 60 * 60 * 1000);
    await user.save();
    
    const emailTemplate = disableAccountMessage(user.name, user.suspendedUntil);
    await sendEmail(user.email, emailTemplate.subject, emailTemplate.html);
  
    res.json({ 
      message: `User dinonaktifkan selama ${suspensionDuration} hari dan email pemberitahuan telah dikirim.`,
      suspendDuration: suspensionDuration, 
      suspendedUntil: user.suspendedUntil
    });

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
    
    // Set status aktif kembali dan reset suspendedUntil
    user.is_active = true;
    user.suspendedUntil = null;
    await user.save();
    
    const emailTemplate = enableAccountMessage(user.name);
    await sendEmail(user.email, emailTemplate.subject, emailTemplate.html);
  
    res.json({ message: "User diaktifkan dan email pemberitahuan telah dikirim." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }
    // Cegah admin memblokir akun sendiri
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({ message: "Admin tidak dapat memblokir akun sendiri" });
    }
    
    // Set flag blokir
    user.isBlocked = true;
    await user.save();

    // Kirim email notifikasi blokir
    const emailTemplate = blockAccountMessage(user.name);
    await sendEmail(user.email, emailTemplate.subject, emailTemplate.html);

    res.json({ message: "User telah diblokir dan email pemberitahuan telah dikirim." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }
    
    // Reset flag blokir
    user.isBlocked = false;
    await user.save();

    // Kirim email notifikasi buka blokir
    const emailTemplate = unblockAccountMessage(user.name);
    await sendEmail(user.email, emailTemplate.subject, emailTemplate.html);

    res.json({ message: "User telah dibuka blokirnya dan email pemberitahuan telah dikirim." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};