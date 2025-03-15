const axios = require('axios');

const botToken = '7762740249:AAGlkzZB32BZ5G4zrGrwZiy71sanRxDC18E';
const chatId = '5136808179';
const message = 'Halo! Ini notifikasi dari JokiDins.';

axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
  chat_id: chatId,
  text: message,
})
.then(response => {
  console.log('Pesan berhasil dikirim:', response.data);
})
.catch(error => {
  console.error('Gagal mengirim pesan:', error);
});
