const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadDir = 'uploads';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Buat order baru (POST /api/orders)
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    const { service, description, deadline } = req.body;
    
    const orderData = {
      user: req.user._id,
      service,
      description,
      deadline,
    };

    // Add file information if a file was uploaded
    if (req.file) {
      orderData.file = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path
      };
    }

    const order = new Order(orderData);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ambil order untuk user yang sedang login (GET /api/orders)
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ambil order berdasarkan id (GET /api/orders/:id)
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' });
    // Pastikan order milik user yang sedang login
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Tidak diizinkan' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download file (GET /api/orders/:id/file)
router.get('/:id/file', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' });
    if (!order.file) return res.status(404).json({ message: 'File tidak ditemukan' });
    
    // Verify user authorization
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Tidak diizinkan' });
    }

    res.download(order.file.path, order.file.originalName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order (PUT /api/orders/:id)
router.put('/:id', protect, upload.single('file'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Tidak diizinkan' });
    }

    order.service = req.body.service || order.service;
    order.description = req.body.description || order.description;
    order.deadline = req.body.deadline || order.deadline;
    order.status = req.body.status || order.status;

    // Update file if new one is uploaded
    if (req.file) {
      order.file = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path
      };
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete order (DELETE /api/orders/:id)
router.delete('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Tidak diizinkan' });
    }
    await order.deleteOne(); // Using deleteOne() instead of remove()
    res.json({ message: 'Order berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;