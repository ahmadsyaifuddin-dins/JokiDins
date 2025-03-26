const User = require("../models/User");
const sendEmail = require("../utils/sendEmail"); // pastikan sudah import fungsi sendEmail

exports.disableUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan." });
      }
      
      const emailTemplate = disableAccountMessage(user.name);
      await sendEmail(user.email, emailTemplate.subject, emailTemplate.html);
  
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
        
      const emailTemplate = enableAccountMessage(user.name);
      await sendEmail(user.email, emailTemplate.subject, emailTemplate.html);
  
      res.json({ message: "User diaktifkan dan email pemberitahuan telah dikirim." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };