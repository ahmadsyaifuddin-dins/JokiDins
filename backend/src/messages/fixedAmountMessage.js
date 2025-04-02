// messages/fixedAmountMessage.js
function getFixedAmountMessage(order) {
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(order.fixedAmount);

  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://www.joki-dins.my.id/images/JokiDins-new_tiny.jpg" alt="JokiDins Icon" style="max-width: 150px; height: auto;">
    </div>
    
    <h2 style="color: #4a154b; text-align: center;">Update Pembayaran Order 💰</h2>
    
    <p style="font-size: 16px; line-height: 1.5; color: #333;">Halo, ${order.user.name}</p>
    
    <p style="font-size: 16px; line-height: 1.5; color: #333;">
      Kami ingin memberikan informasi bahwa nominal fixed pembayaran untuk order Anda telah di-set menjadi:
    </p>
    
    <div style="text-align: center; margin: 25px 0; padding: 15px; background-color: #f9f9f9; border-radius: 6px; border-left: 4px solid #4a154b;">
      <p style="font-size: 24px; font-weight: bold; color: #4a154b; margin: 0;">
        ${formattedAmount}
      </p>
    </div>
    
    <p style="font-size: 16px; line-height: 1.5; color: #333;">
      Silakan selesaikan pembayaran sesuai nominal tersebut untuk melanjutkan proses order Anda.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://joki-dins.my.id/payment" style="background-color: #4a154b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">
        LAKUKAN PEMBAYARAN
      </a>
    </div>
    
    <p style="font-size: 16px; line-height: 1.5; color: #333;">
      Jika Anda memiliki pertanyaan terkait pembayaran, jangan ragu untuk menghubungi tim customer service kami.
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
      <p style="font-size: 16px; color: #333;">Terima kasih,</p>
      <p style="font-size: 16px; font-weight: bold; color: #4a154b;">Tim JokiDins</p>
    </div>
  </div>
  `;
}

module.exports = getFixedAmountMessage;