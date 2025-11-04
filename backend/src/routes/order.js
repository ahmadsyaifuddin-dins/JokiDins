// routes/order.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
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

// Setup multer untuk in-memory storage (untuk Vercel)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB (naikkan dari 1MB)
  },
  fileFilter: (req, file, cb) => {
    // Accept common file types
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|zip|rar/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('File type not allowed. Only images, PDFs, docs, and archives are allowed.'));
  },
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