// utils/emailTemplates.js
function getVerificationEmailMessage(name, verificationCode, expirationMinutes) {
    return `
      <p>Halo ${name},</p>
      <p>Berikut adalah kode verifikasi email baru Anda:</p>
      <h2>${verificationCode}</h2>
      <p>Masukkan kode tersebut pada halaman verifikasi untuk mengaktifkan akun Anda.</p>
      <p>Kode verifikasi ini akan berlaku selama ${expirationMinutes} menit.</p>
    `;
  }
  
  module.exports = { getVerificationEmailMessage };
  