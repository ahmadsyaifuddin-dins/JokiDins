const { put } = require('@vercel/blob');
const User = require('../models/User');

// Upload avatar ke Vercel Blob
const uploadAvatar = async (req) => {
  try {
    // Validasi apakah ada file
    if (!req.body.file && !req.file) {
      throw { 
        status: 400, 
        message: 'Tidak ada file yang di-upload',
        details: 'File is required'
      };
    }

    let fileBuffer;
    let fileName;
    let contentType;

    // Support untuk base64 dari body
    if (req.body.file) {
      const base64Data = req.body.file.replace(/^data:image\/\w+;base64,/, '');
      fileBuffer = Buffer.from(base64Data, 'base64');
      fileName = `avatar-${req.user._id}-${Date.now()}.png`;
      contentType = 'image/png';
    } 
    // Support untuk multipart form-data
    else if (req.file) {
      fileBuffer = req.file.buffer;
      fileName = `avatar-${req.user._id}-${Date.now()}-${req.file.originalname}`;
      contentType = req.file.mimetype;
    }

    // Validasi ukuran file (max 5MB)
    if (fileBuffer.length > 5 * 1024 * 1024) {
      throw { 
        status: 400, 
        message: 'File terlalu besar',
        details: 'Maximum file size is 5MB'
      };
    }

    // Upload ke Vercel Blob
    const blob = await put(fileName, fileBuffer, {
      access: 'public',
      contentType: contentType,
      addRandomSuffix: false,
    });

    return { blob };
  } catch (error) {
    console.error('Error in uploadAvatar:', error);
    throw error;
  }
};

// Update avatar user di database
const updateUserAvatar = async (userId, avatarUrl) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    );

    if (!user) {
      throw { 
        status: 404, 
        message: 'User tidak ditemukan' 
      };
    }

    return user;
  } catch (error) {
    console.error('Error updating user avatar:', error);
    throw error;
  }
};

module.exports = {
  uploadAvatar,
  updateUserAvatar,
};