// utils/welcomeMessage.js
function getWelcomeMessage(name) {
    return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://www.joki-dins.my.id/images/JokiDins-new.png" alt="JokiDins Icon" style="max-width: 150px; height: auto;">
    </div>
    
    <h2 style="color: #4a154b; text-align: center;">Selamat Datang di JokiDins, ${name}! 🎉</h2>
    
    <p style="font-size: 16px; line-height: 1.5; color: #333;">Halo ${name},</p>
    
    <p style="font-size: 16px; line-height: 1.5; color: #333;">
      Terima kasih telah bergabung dengan <strong>JokiDins!</strong>, Kami sangat senang Anda mempercayai kami untuk membantu Anda dalam menyelesaikan berbagai tugas dan proyek. Kami akan memberikan yang terbaik demi kepuasan Anda.
    </p>
    
    <p style="font-size: 16px; line-height: 1.5; color: #333;">
      JokiDins hadir untuk membantu Anda menyelesaikan berbagai tugas dan proyek dengan hasil terbaik dan tepat waktu. Tim ahli kami siap membantu Anda dengan:
    </p>
    
    <ul style="font-size: 16px; line-height: 1.5; color: #333;">
      <li>Tugas pemrograman dan coding</li>
      <li>Proyek desain UI/UX</li>
      <li>Assignment dan paper akademik</li>
      <li>Dan berbagai layanan lainnya</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://joki-dins.my.id" style="background-color: #4a154b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">
        KUNJUNGI WEBSITE KAMI
      </a>
    </div>
    
    <p style="font-size: 16px; line-height: 1.5; color: #333;">
      Silakan kunjungi website kami di <a href="https://joki-dins.my.id" style="color: #4a154b; text-decoration: underline;">https://joki-dins.my.id</a> untuk menjelajahi layanan lengkap kami dan mendapatkan penawaran khusus untuk pengguna baru!
    </p>
    
    <p style="font-size: 16px; line-height: 1.5; color: #333;">
      Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi tim customer service kami.
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
      <p style="font-size: 16px; color: #333;">Salam hangat,</p>
      <p style="font-size: 16px; font-weight: bold; color: #4a154b;">Ceo & Founder Ahmad Syaifuddin</p>
    </div>
  </div>
    `;
  }
  
  module.exports = getWelcomeMessage;
  