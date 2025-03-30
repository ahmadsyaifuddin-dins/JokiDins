// messages/blockAccountMessage.js
exports.blockAccountMessage = (name) => ({
    subject: "⚠️ Akun Kamu Telah Diblokir",
    html: `<div style="text-align: center;">
             <img src="https://www.joki-dins.my.id/images/JokiDins-new_tiny.jpg" alt="JokiDins Logo" style="max-width: 150px; margin-bottom: 20px;">
           </div>
           <p>Hey ${name},</p>
           <p>Mohon maaf, akun kamu saat ini telah diblokir oleh Developer kami.</p>
           <p>Merasa ini tidak seharusnya terjadi? No worries! Langsung hubungi kami untuk klarifikasi dan penyelesaian masalah blokir ini.</p>
           <p>Kami siap bantu kamu 24/7!</p>
           <p>Thanks,<br>Tim JokiDins</p>`
  });