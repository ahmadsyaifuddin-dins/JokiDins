// src/routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const { uploadAvatar, updateUserAvatar } = require("../controllers/uploadController");

// Setup multer untuk handle file upload (in-memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

// Route dengan middleware multer
router.post("/upload", protect, upload.single('avatar'), async (req, res) => {
  try {
    // Proses upload file
    const { blob } = await uploadAvatar(req);
    
    // Update avatar di MongoDB
    await updateUserAvatar(req.user._id, blob.url);
    
    // Return response
    return res.status(200).json({
      success: true,
      url: blob.url,
      downloadUrl: blob.downloadUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      error: error.message || "Gagal meng-upload file",
      details: error.details || "",
    });
  }
});

module.exports = router;