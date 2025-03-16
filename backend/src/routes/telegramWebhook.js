// routes/telegramWebhook.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../models/User");

router.post("/webhook", async (req, res) => {
  try {
    const update = req.body;
    console.log("Received update:", update); // Debug logging

    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text;

      // Format pesan yang diharapkan: "/start <token>"
      if (text && text.startsWith("/start")) {
        const parts = text.split(" ");
        if (parts.length >= 2) {
          const token = parts[1];

          // Cari user berdasarkan token
          const user = await User.findOne({ telegramToken: token });
          if (user) {
            user.telegramChatId = chatId;
            user.telegramToken = null; // pastikan token hanya sekali pakai
            await user.save();

            // Buat pesan selamat datang yang personal dan informatif
            const userName = user.name || "User";
            const welcomeText = `Halo ${userName}! Akun Telegram kamu sudah terhubung.
Mulai sekarang, kamu akan menerima notifikasi real-time tentang order dan update penting.
Ketik /help untuk melihat daftar perintah yang tersedia.`;

            // Siapkan inline keyboard dengan beberapa tombol
            const inlineKeyboard = {
              inline_keyboard: [
                [
                  { text: "Lihat Order", url: "https://joki-dins.my.id/OrderList" },
                  { text: "Bantuan", callback_data: "help" }
                ],
                [
                  { text: "Kontak Support", url: "https://joki-dins.my.id/contact" }
                ]
              ]
            };

            // Kirim balasan ke user via Telegram API
            const botToken = process.env.TELEGRAM_BOT_TOKEN;
            const replyUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
            await axios.post(replyUrl, {
              chat_id: chatId,
              text: welcomeText,
              reply_markup: inlineKeyboard
            });
          }
        }
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Error processing Telegram webhook:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
