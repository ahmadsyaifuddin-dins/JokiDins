// utils/blockAccountMessage.js
exports.blockAccountMessage = (name) => ({
    subject: "Akun Anda Telah Diblokir",
    html: `<p>Halo ${name},</p>
           <p>Akun Anda telah diblokir oleh Developer. Jika Anda merasa ini kesalahan, silakan hubungi Developer.</p>`
  });
  