const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent) => {
  // Contoh menggunakan Gmail (untuk development)
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // misalnya: your-email@gmail.com
      pass: process.env.EMAIL_PASS, // password atau App Password Gmail
    },
  });

  let info = await transporter.sendMail({
    from: '"JokiDins" <no-reply@joki-dins.my.id>',
    to,
    subject,
    html: htmlContent,
  });

  console.log("Pesan email terkirim: %s", info.messageId);
};

module.exports = sendEmail;
