// utils/unblockAccountMessage.js
exports.unblockAccountMessage = (name) => ({
    subject: "Akun Anda Telah Dibuka Blokirnya",
    html: `<p>Halo ${name},</p>
           <p>Akun Anda telah dibuka blokirnya oleh Developer. Anda sekarang dapat login kembali.</p>`
  });
  