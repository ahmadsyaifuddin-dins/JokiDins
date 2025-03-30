// messages/unverifiedLoginMessage.js
exports.getUnverifiedLoginMessage = (name, verificationCode, expirationMinutes) => {
    return `
      <div style="text-align: center;">
        <img src="https://www.joki-dins.my.id/images/JokiDins-new.png" alt="JokiDins Logo" style="max-width: 200px; margin-bottom: 20px;">
      </div>
      <p>Hey ${name}! ✨</p>
      <p>Kamu belum memverifikasi akun kamu. Berikut adalah kode verifikasi email baru:</p>
      <h2 style="text-align: center; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">${verificationCode}</h2>
      <p>Masukkan kode tersebut pada halaman verifikasi untuk mengaktifkan akun kamu.</p>
      <p>Kode verifikasi ini akan berlaku selama ${expirationMinutes} menit.</p>
      <p>Cheers,<br>Tim JokiDins</p>
    `;
  };