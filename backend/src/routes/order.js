const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const fs = require("fs");

const uploadDir = "uploads/order";

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/order/");
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
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// ============================================================
// CREATE ORDER (POST /api/orders)
// ============================================================
router.post("/", protect, upload.single("file"), async (req, res) => {
  try {
    const { service, description, deadline, phone, provider } = req.body;

    // Pastikan nomor hp dan provider sudah dikirim
    if (!phone || !provider) {
      return res
        .status(400)
        .json({ message: "Nomor HP dan provider wajib diisi" });
    }

    const orderData = {
      user: req.user._id,
      service,
      description,
      deadline,
      phone,
      provider
    };

    if (req.file) {
      orderData.file = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
      };
    }

    const order = new Order(orderData);
    await order.save();

    // Update daftar nomor HP di profil user jika nomor baru
    const User = require("../models/User");
    if (!req.user.phones || !req.user.phones.includes(phone)) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { phones: phone },
      });
    }
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// GET ALL ORDERS (ADMIN) or ORDERS BY USER (GET /api/orders)
// ============================================================
router.get("/", protect, async (req, res) => {
  try {
    // Jika admin, ambil semua order + populate user email
    if (req.user.role === "admin") {
      const orders = await Order.find({}).populate("user", "name email");
      return res.json(orders);
    } else {
      // Kalau user biasa, hanya order miliknya
      const orders = await Order.find({ user: req.user._id }).populate(
        "user",
        "email",
      );
      return res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// GET SINGLE ORDER (GET /api/orders/:id)
// ============================================================
router.get("/:id", protect, async (req, res) => {
  try {
    // Populate user agar admin bisa melihat info user, misal email
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    // Jika bukan admin dan bukan pemilik order, tolak
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Tidak diizinkan" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// DOWNLOAD FILE (GET /api/orders/:id/file)
// ============================================================
router.get("/:id/file", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });
    if (!order.file)
      return res.status(404).json({ message: "File tidak ditemukan" });

    // Jika bukan admin dan bukan pemilik order, tolak
    if (
      req.user.role !== "admin" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Tidak diizinkan" });
    }

    res.download(order.file.path, order.file.originalName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// UPDATE ORDER (PUT /api/orders/:id)
// ============================================================
router.put("/:id", protect, upload.single("file"), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    // Jika bukan admin dan bukan pemilik order, tolak
    if (
      req.user.role !== "admin" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Tidak diizinkan" });
    }

    order.service = req.body.service ?? order.service;
    order.description = req.body.description ?? order.description;
    order.deadline = req.body.deadline ?? order.deadline;
    order.status = req.body.status ?? order.status;

    if (req.file) {
      order.file = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
      };
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// DELETE ORDER (DELETE /api/orders/:id)
// ============================================================
router.delete("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    // Jika bukan admin dan bukan pemilik order, tolak
    if (
      req.user.role !== "admin" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Tidak diizinkan" });
    }

    await order.deleteOne();
    res.json({ message: "Order berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
