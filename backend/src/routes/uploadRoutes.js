// src/routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { uploadAvatar, updateUserAvatar } = require("../controllers/uploadController");

router.post("/upload", protect, async (req, res) => {
  try {
    // Proses upload file
    const { blob } = await uploadAvatar(req);
    // Update avatar di MongoDB
    await updateUserAvatar(req.user._id, blob.url);
    // Return response
    return res.status(200).json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    const status = error.status || 500;
    return res.status(status).json({
      error: error.message || "Gagal meng-upload file",
      details: error.details || "",
    });
  }
});

module.exports = router;
