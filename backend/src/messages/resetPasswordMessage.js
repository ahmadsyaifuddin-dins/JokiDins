// messages/resetPasswordMessage.js
exports.getResetPasswordMessage = (name, resetUrl) => {
    return `
      <div style="text-align: center;">
        <img src="https://www.joki-dins.my.id/images/JokiDins-new_tiny.jpg" alt="JokiDins Logo" style="max-width: 150px; margin-bottom: 20px;">
      </div>
      <p>Hey ${name}! ✨</p>
      <p>Kami menerima permintaan untuk mereset password akun kamu.</p>
      <p>Silakan klik link berikut untuk mengatur ulang password kamu:</p>
      <p style="text-align: center;">
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4285f4; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Reset Password
        </a>
      </p>
      <p>Atau copy link ini:</p>
      <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 5px;">${resetUrl}</p>
      <p>Link ini akan kadaluwarsa dalam 1 jam.</p>
      <p>Jika kamu tidak meminta reset password, abaikan email ini.</p>
      <p>Thanks,<br>Tim JokiDins</p>
    `;
  };