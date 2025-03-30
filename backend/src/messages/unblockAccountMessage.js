// messages/unblockAccountMessage.js
exports.unblockAccountMessage = (name) => ({
    subject: "🎉 Akun Kamu Sudah Dibuka Blokirnya!",
    html: `<div style="text-align: center;">
             <img src="https://www.joki-dins.my.id/images/JokiDins-new_tiny.jpg" alt="JokiDins Logo" style="max-width: 150px; margin-bottom: 20px;">
           </div>
           <p>Hey ${name}! ✨</p>
           <p>Great news! Akun kamu sudah dibuka blokirnya.</p>
           <p>Developer kami telah membuka blokir pada akun kamu. Sekarang kamu bisa login lagi dan lanjut menggunakan semua fitur.</p>
           <p>Kalau butuh bantuan, jangan ragu untuk hubungi kami ya!</p>
           <p>Cheers,<br>Tim JokiDins</p>`
  });