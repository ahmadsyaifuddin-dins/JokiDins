// src/controllers/uploadController.js
const { formidable } = require("formidable");
const { put, del } = require("@vercel/blob");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");

/**
 * Fungsi untuk memproses upload avatar.
 * Mengembalikan promise agar bisa ditangani secara asynchronous.
 */
const processUpload = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: false,
      maxFileSize: 1.5 * 1024 * 1024, // 1.5MB
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        // Spesifik error untuk ukuran file
        if (
          err.code === "ETOOBIG" ||
          err.message.includes("maxTotalFileSize") ||
          err.message.includes("maxFileSize")
        ) {
          return reject({
            status: 400,
            message: "Ukuran file melebihi batas",
            details: "File yang diunggah terlalu besar. Maksimal 1.5MB.",
          });
        }
        return reject({
          status: 500,
          message: "Gagal meng-upload file",
          details: err.message,
        });
      }
      resolve({ fields, files });
    });
  });
};

const uploadAvatar = async (req) => {
  // Parse form dengan promise
  const { fields, files } = await processUpload(req);

  // Ambil file yang diupload
  const file = files.photo?.[0] || files.photo;
  if (!file) {
    throw { status: 400, message: "Tidak ada file yang dikirim" };
  }

  // Daftar MIME type yang diizinkan
  const allowedImageTypes = [
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'image/svg+xml', 
    'image/webp', 
    'image/avif'
  ];

  // Validasi tipe file
  const mimeType = file.mimetype || file.type;
  if (!mimeType || !allowedImageTypes.includes(mimeType)) {
    throw { 
      status: 400, 
      message: "Jenis file tidak valid", 
      details: "Hanya file gambar yang diperbolehkan. Gunakan format: JPG, PNG, GIF, SVG, WebP, atau AVIF."
    };
  }

  // Baca file content
  const fileContent = await fs.promises.readFile(file.filepath || file.path);

  // Buat nama file unik
  const originalFileName = file.originalFilename || file.name || "profile";
  const fileName = `profile-${Date.now()}${path.extname(originalFileName)}`;

  // Upload ke Vercel Blob
  const blob = await put(fileName, fileContent, {
    access: "public",
    addRandomSuffix: false,
    contentType: mimeType,
    path: "photo_profile",
  });

  // Bersihkan file sementara
  try {
    await fs.promises.unlink(file.filepath || file.path);
  } catch (cleanupError) {
    console.error("Error cleaning up file:", cleanupError);
  }

  return { blob };
};

const updateUserAvatar = async (userId, newAvatarUrl) => {
  // Ambil user untuk cek avatar lama
  const user = await User.findById(userId);
  if (user && user.avatar) {
    // Misal URL avatar berbentuk: https://vercel.blob/your-bucket/photo_profile/profile-123456789.jpg
    const oldFileName = path.basename(user.avatar);
    try {
      // Hapus file lama di Vercel Blob
      await del(oldFileName, { path: "photo_profile" });
      console.log("File lama dihapus:", oldFileName);
    } catch (error) {
      console.error("Gagal menghapus file lama:", error);
      // Opsional: kamu bisa lanjutkan proses meski gagal hapus file lama
    }
  }
  // Update avatar di MongoDB dengan URL baru
  await User.findByIdAndUpdate(userId, { avatar: newAvatarUrl });
};

module.exports = { uploadAvatar, updateUserAvatar };
