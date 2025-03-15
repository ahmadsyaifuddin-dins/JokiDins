const axios = require('axios');
const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

const sendTelegramNotification = async (message) => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });
    console.log('Telegram notification sent:', response.data);
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
};

module.exports = { sendTelegramNotification };
