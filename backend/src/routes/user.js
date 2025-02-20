const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// Endpoint untuk dapatkan profile user yang sedang login
router.get("/profile", protect, async (req, res) => {
  // Karena protect sudah mengisi req.user, tinggal kirim balik data itu.
  res.json(req.user);
});

module.exports = router;
