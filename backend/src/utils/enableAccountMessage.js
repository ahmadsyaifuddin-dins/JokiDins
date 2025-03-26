const enableAccountMessage = (userName) => {
    return {
      subject: "Akun Anda Telah Diaktifkan Kembali",
      html: `
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #e7f3fe; padding: 10px; text-align: center; }
            .content { padding: 20px; }
            .footer { font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Konfirmasi Aktivasi Akun</h1>
            </div>
            <div class="content">
              <p>Kepada Yth. ${userName},</p>
              
              <p>Kami ingin memberitahukan bahwa akun Anda telah diaktifkan kembali pada ${new Date().toLocaleDateString()}.</p>
              
              <p>Anda kini dapat kembali mengakses layanan kami seperti biasa. Jika Anda memiliki pertanyaan atau mengalami kendala, silakan hubungi tim dukungan kami.</p>
              
              <p>Terima kasih atas kepercayaan Anda.</p>
              
              <p>Salam hormat,<br>Tim Manajemen Akun</p>
            </div>
            <div class="footer">
              <p>Email ini dikirim secara otomatis. Mohon tidak membalas.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  };