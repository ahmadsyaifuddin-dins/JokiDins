const User = require("../models/User");
const sendEmail = require("../utils/sendEmail"); // pastikan sudah import fungsi sendEmail

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

    // Logging aktivitas admin
    // console.log(`Admin ${req.user._id} menonaktifkan user ${userId} pada ${new Date().toISOString()}`);

    // Kirim email notifikasi ke user bahwa akunnya telah dinonaktifkan
    const subject = "Akun Anda Telah Dinonaktifkan";
    const message = `
      <p>Halo ${user.name},</p>
      <p>Akun Anda telah dinonaktifkan oleh Developer. Jika Anda merasa ini adalah sebuah kesalahan atau membutuhkan bantuan, silakan hubungi support kami.</p>
      <p>Terima kasih.</p>
    `;
    await sendEmail(user.email, subject, message);

    res.json({ message: "User dinonaktifkan dan email pemberitahuan telah dikirim." });
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

    // Logging aktivitas Developer
    // console.log(`Admin ${req.user._id} mengaktifkan user ${userId} pada ${new Date().toISOString()}`);

    // Kirim email notifikasi ke user bahwa akunnya telah diaktifkan kembali
    const subject = "Akun Anda Telah Diaktifkan Kembali";
    const message = `
      <p>Halo ${user.name},</p>
      <p>Akun Anda telah diaktifkan kembali oleh admin. Anda kini dapat login dan menggunakan layanan kami seperti biasa.</p>
      <p>Terima kasih.</p>
    `;
    await sendEmail(user.email, subject, message);

    res.json({ message: "User diaktifkan dan email pemberitahuan telah dikirim." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
