const disableAccountMessage = (userName) => {
    return {
      subject: "Akun anda di Suspent",
      html: `
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f4f4f4; padding: 10px; text-align: center; }
            .content { padding: 20px; }
            .footer { font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Pemberitahuan Status Akun</h1>
            </div>
            <div class="content">
              <p>Kepada ${userName},</p>
              
              <p>Kami ingin menginformasikan bahwa status akun Anda telah diperbarui pada ${new Date().toLocaleDateString()}.</p>
              
              <p>Jika Anda merasa ini bukan merupakan tindakan yang Anda kehendaki, atau memiliki pertanyaan lebih lanjut, silakan hubungi tim dukungan kami.</p>
              
              <p>Terima kasih atas perhatian Anda.</p>
              
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