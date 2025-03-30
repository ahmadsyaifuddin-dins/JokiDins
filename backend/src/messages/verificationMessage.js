// messages/verificationMessage.js
exports.getVerificationMessage = (name, verificationCode, expirationMinutes) => {
    return `
      <div style="text-align: center;">
        <img src="https://www.joki-dins.my.id/images/JokiDins-new_tiny.jpg" alt="JokiDins Logo" style="max-width: 150px; margin-bottom: 20px;">
      </div>
      <p>Hey ${name}! ✨</p>
      <p>Terima kasih telah mendaftar di JokiDins. Berikut adalah kode verifikasi email kamu:</p>
      <h2 style="text-align: center; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">${verificationCode}</h2>
      <p>Masukkan kode tersebut pada halaman verifikasi untuk mengaktifkan akun kamu.</p>
      <p>Kode verifikasi ini akan berlaku selama ${expirationMinutes} menit.</p>
      <p>Cheers,<br>Tim JokiDins</p>
    `;
  };