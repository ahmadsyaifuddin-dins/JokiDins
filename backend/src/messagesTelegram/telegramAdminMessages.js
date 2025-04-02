/**
 * Generate notification message for admin when a new order is created
 * @param {Object} data - Order data
 * @param {Object} userData - User data 
 * @param {string} formattedDeadline - Formatted deadline date
 * @returns {string} Formatted telegram message
 */
const newOrderNotification = (data, userData, formattedDeadline) => {
  // Format payment amount with comma separator
  const formattedPayment = data.paymentAmount 
    ? parseInt(data.paymentAmount).toLocaleString('id-ID').replace(/\./g, ',') 
    : "0";

  return `
🔔 *Pesanan Baru Masuk Dins 😺* 🔔
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 *Detail Klien:*
   • Nama: ${userData.name}
   • Kontak: ${data.phone}
   • Provider: ${data.provider}

📋 *Detail Pesanan:*
   • Jasa: ${data.service}
   • Paket: ${data.packageName}
   • Deadline: ${formattedDeadline}
   
💰 *Pembayaran:*
   • Nominal: Rp ${formattedPayment}

📝 *Deskripsi Pesanan:*
${data.description}

⚡️ Silahkan segera tindak lanjuti pesanan ini! ⚡️
  `.trim();
};

module.exports = {
  newOrderNotification
};