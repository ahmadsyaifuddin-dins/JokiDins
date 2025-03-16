const axios = require("axios");

const sendTelegramNotification = async (chatId, message, parseMode = "Markdown") => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: parseMode,
    });
    console.log("Telegram notification sent:", response.data);
  } catch (error) {
    console.error("Error sending Telegram notification:", error.message);
  }
};

module.exports = { sendTelegramNotification };
