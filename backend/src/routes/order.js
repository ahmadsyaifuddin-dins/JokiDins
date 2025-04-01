// routes/order.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const fs = require("fs");
const {
  createOrder,
  getOrders,
  getOrderById,
  downloadFile,
  updateOrder,
  fixedAmount,
  updatePayment,
  deleteOrder,
  deleteAllOrders,
} = require("../controllers/orderController");

const uploadDir = "uploads/order";

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
});

// Routes
router.post("/", protect, upload.single("file"), createOrder);
router.put("/:id", protect, upload.single("file"), updateOrder);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);
router.get("/:id/file", protect, downloadFile);
router.put("/:orderId/fixed-amount", protect, fixedAmount);
router.put("/:orderId/payment", protect, updatePayment);
router.delete("/all", protect, deleteAllOrders);
router.delete("/:id", protect, deleteOrder);

module.exports = router;
