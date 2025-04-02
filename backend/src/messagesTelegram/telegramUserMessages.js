// messagesTelegram/telegramUserMessages.js

/**
 * Format number to Indonesian Rupiah format
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount with commas
 */
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  /**
   * Generate notification message for user when their new order is received
   * @param {Object} order - Order data object
   * @param {Object} user - User data object
   * @returns {string} Formatted telegram message
   */
  const orderReceived = (order, user) => {
    const formattedDeadline = new Date(order.deadline).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    
    const formattedAmount = order.paymentAmount ? formatCurrency(order.paymentAmount) : "Rp0";
    
    return `
  *KONFIRMASI PESANAN*
  
  Halo *${user.name}* 👋,
  
  Order Joki *${order.service}* kamu baru saja kami terima!
  
  *Detail Pesanan:*
  📦 Paket: *${order.packageName}*
  📝 Deskripsi: ${order.description}

  ⏰ Deadline: *${formattedDeadline}*
  📱 Kontak: ${order.phone} (${order.provider})
  💰 Nominal Pembayaran: *${formattedAmount}*
  
  Status pembayaran kamu saat ini: *${order.paymentStatus.toUpperCase()}*
  
  Kami sedang memproses order tersebut dan akan segera mengabari kamu.
  Terima kasih telah menggunakan JokiDins! 😺
    `.trim();
  };
  
  /**
   * Generate notification message for order status updates
   * @param {string} userName - User's name
   * @param {Object} order - Order data
   * @returns {string} Formatted telegram message based on status
   */
  const orderStatusUpdate = (userName, order) => {
    const formattedAmount = order.paymentAmount ? formatCurrency(order.paymentAmount) : "Rp0";
    const fixedAmount = order.fixedAmount ? formatCurrency(order.fixedAmount) : "belum ditentukan";
    
    switch (order.status) {
      case "processing":
        return `
  *UPDATE STATUS PESANAN*
  
  Halo *${userName}* 🚀,
  
  Order Joki *${order.service}* kamu *sedang dikerjakan* saat ini!
  
  *Detail Pesanan:*
  📦 Paket: *${order.packageName}*
  💰 Total Biaya: *${fixedAmount}*
  💸 Sudah Dibayar: *${formattedAmount}*
  🔄 Status Pembayaran: *${order.paymentStatus.toUpperCase()}*
  
  Santai aja, tim kami sedang bekerja keras untuk kamu. Kami akan memberikan update jika ada perkembangan.
  
  Tim JokiDins 💪
        `.trim();
        
      case "completed":
        return `
  *PESANAN SELESAI*
  
  🎉 Selamat *${userName}*! 🎉
  
  Order Joki *${order.service}* kamu sudah *SELESAI*!
  
  *Detail Pesanan:*
  📦 Paket: *${order.packageName}*
  💰 Total Biaya: *${fixedAmount}*
  💸 Sudah Dibayar: *${formattedAmount}*
  🔄 Status Pembayaran: *${order.paymentStatus.toUpperCase()}*
  
  Silakan cek hasilnya di akun kamu. Jika kamu puas dengan layanan kami, kami akan sangat berterima kasih jika kamu bisa merekomendasikan JokiDins kepada teman-temanmu! 😊
  
  Terima kasih telah mempercayakan pekerjaan ini pada kami!
  
  Tim JokiDins
        `.trim();
        
      case "cancelled":
        return `
  *PESANAN DIBATALKAN*
  
  Halo *${userName}* 😥,
  
  Dengan berat hati kami informasikan bahwa order Joki *${order.service}* kamu telah *DIBATALKAN*.
  
  *Detail Pesanan:*
  📦 Paket: *${order.packageName}*
  💰 Nominal Tagihan: *${fixedAmount}*
  💸 Sudah Dibayar: *${formattedAmount}*
  
  Mohon cek kembali detail order kamu atau hubungi admin kami untuk informasi lebih lanjut mengenai pembatalan ini.
  
  Tim JokiDins
        `.trim();
        
      default:
        return `
  *UPDATE STATUS PESANAN*
  
  Halo *${userName}*,
  
  Status order Joki *${order.service}* kamu telah diperbarui menjadi *${order.status}*.
  
  *Detail Pesanan:*
  📦 Paket: *${order.packageName}*
  💰 Total Biaya: *${fixedAmount}*
  💸 Sudah Dibayar: *${formattedAmount}*
  🔄 Status Pembayaran: *${order.paymentStatus.toUpperCase()}*
  
  Jika kamu memiliki pertanyaan, jangan ragu untuk menghubungi admin kami.
  
  Tim JokiDins
        `.trim();
    }
  };
  
  /**
   * Generate notification message when fixed amount is set
   * @param {string} userName - User's name
   * @param {Object} order - Order data
   * @returns {string} Formatted telegram message
   */
  const fixedAmountSet = (userName, order) => {
    const formattedFixedAmount = formatCurrency(order.fixedAmount);
    const formattedPaid = formatCurrency(order.paymentAmount);
    const formattedRemaining = formatCurrency(order.fixedAmount - order.paymentAmount);
    
    return `
  *INFORMASI PEMBAYARAN*
  
  Halo *${userName}*,
  
  Total biaya untuk order Joki *${order.service}* kamu telah ditetapkan.
  
  *Detail Pembayaran:*
  📦 Paket: *${order.packageName}*
  💰 Total Biaya: *${formattedFixedAmount}*
  💸 Sudah Dibayar: *${formattedPaid}*
  🔄 Sisa Pembayaran: *${formattedRemaining}*
  
  Silakan selesaikan pembayaran sesuai nominal tersebut melalui metode pembayaran yang tersedia.
  
  Terima kasih!
  Tim JokiDins 💼
    `.trim();
  };
  
  /**
   * Generate notification message when payment is updated
   * @param {string} userName - User's name
   * @param {Object} order - Order data
   * @param {number} additionalPayment - Additional payment amount
   * @returns {string} Formatted telegram message
   */
  const paymentUpdated = (userName, order, additionalPayment) => {
    const formattedFixedAmount = formatCurrency(order.fixedAmount);
    const formattedPaid = formatCurrency(order.paymentAmount);
    const formattedAdditional = formatCurrency(additionalPayment);
    const formattedRemaining = formatCurrency(Math.max(0, order.fixedAmount - order.paymentAmount));
    
    let paymentStatus = "";
    if (order.paymentStatus === "lunas") {
      paymentStatus = "✅ LUNAS";
    } else if (order.paymentStatus === "dicicil") {
      paymentStatus = "🔄 DICICIL";
    } else {
      paymentStatus = "❌ BELUM DIBAYAR";
    }
    
    return `
  *UPDATE PEMBAYARAN*
  
  Halo *${userName}*,
  
  Pembayaran sebesar *${formattedAdditional}* untuk order Joki *${order.service}* kamu telah kami terima!
  
  *Detail Pembayaran:*
  📦 Paket: *${order.packageName}*
  💰 Total Biaya: *${formattedFixedAmount}*
  💸 Total Sudah Dibayar: *${formattedPaid}*
  ${formattedRemaining !== "Rp0" ? `🔄 Sisa Pembayaran: *${formattedRemaining}*` : ''}
  📊 Status Pembayaran: *${paymentStatus}*
  
  ${order.paymentStatus === "lunas" ? 
    "Terima kasih telah melunasi pembayaran! Kami akan segera memproses pesanan kamu." : 
    "Silakan selesaikan sisa pembayaran untuk memproses pesanan kamu lebih lanjut."}
  
  Tim JokiDins 💼
    `.trim();
  };
  
  module.exports = {
    orderReceived,
    orderStatusUpdate,
    fixedAmountSet,
    paymentUpdated,
    formatCurrency
  };