// Misalnya di file messages/fixedAmountMessage.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // bisa juga pakai layanan lain sesuai kebutuhan
  auth: {
    user: process.env.EMAIL_USER, // simpan di .env
    pass: process.env.EMAIL_PASS,
  },
});

const sendFixedAmountNotification = (recipientEmail, order) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: "Update Nominal Pembayaran Order",
    text: `Halo,
    
Nominal fixed pembayaran untuk order kamu telah di-set menjadi ${new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(order.fixedAmount)}.

Silakan selesaikan pembayaran sesuai nominal tersebut.

Terima kasih.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error saat mengirim email:", error);
    } else {
      console.log("Email terkirim:", info.response);
    }
  });
};

module.exports = { sendFixedAmountNotification };
