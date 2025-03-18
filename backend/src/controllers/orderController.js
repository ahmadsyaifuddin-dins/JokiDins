// controllers/orderController.js
const Order = require("../models/Order");
const User = require("../models/User");
const fs = require("fs");
const { sendTelegramNotification } = require("../services/telegramNotifier");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { service, description, deadline, phone, provider } = req.body;
    if (!phone || !provider) {
      return res.status(400).json({ message: "Nomor HP dan provider wajib diisi" });
    }
    const orderData = {
      user: req.user._id,
      service,
      description,
      deadline,
      phone,
      provider,
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
    if (!req.user.phones || !req.user.phones.includes(phone)) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { phones: phone },
      });
    }

    const formattedDeadline = new Date(deadline).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const notifMessage = `
      Ada Order baru masuk Dins 😊!
      
      👤 *Klien:* ${req.user.name}
      
      🛠️ *Layanan:* ${service}
      
      📝 *Deskripsi:* ${description}
      
      ⏰ *Deadline:* ${formattedDeadline}
      
      📱 *Kontak:* ${phone}
      
      🔌 *Provider:* ${provider}
    `.trim();

    await sendTelegramNotification(process.env.TELEGRAM_CHAT_ID, notifMessage);

    if (req.user.telegramChatId) {
      const userNotifMessage = `
Halo ${req.user.name}, order Joki *${service}* kamu baru saja kami terima!
Kami sedang memproses order tersebut dan akan segera mengabari kamu.
Terima kasih telah menggunakan JokiDins!
      `.trim();
      await sendTelegramNotification(req.user.telegramChatId, userNotifMessage, "Markdown");
    } else {
      console.log("User belum menghubungkan akun Telegram.");
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ORDERS (ADMIN) or ORDERS BY USER
const getOrders = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const orders = await Order.find({}).populate("user", "name email");
      return res.json(orders);
    } else {
      const orders = await Order.find({ user: req.user._id }).populate("user", "email");
      return res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE ORDER
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    if (req.user.role !== "admin" && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Tidak diizinkan" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DOWNLOAD FILE
const downloadFile = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });
    if (!order.file)
      return res.status(404).json({ message: "File tidak ditemukan" });

    if (req.user.role !== "admin" && order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Tidak diizinkan" });
    }

    res.download(order.file.path, order.file.originalName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ORDER
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    if (req.user.role !== "admin" && order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Tidak diizinkan" });
    }

    order.service = req.body.service ?? order.service;
    order.description = req.body.description ?? order.description;
    order.deadline = req.body.deadline ?? order.deadline;

    const newStatus = req.body.status ?? order.status;
    if (newStatus === "completed" && order.status !== "completed") {
      order.completedAt = new Date();
    } else if (newStatus !== "completed") {
      order.completedAt = null;
    }
    order.status = newStatus;

    if (req.file) {
      order.file = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
      };
    }

    const updatedOrder = await order.save();

    // Hanya kirim notifikasi jika yang update adalah admin
    if (req.user.role === "admin") {
      let orderOwner = await User.findById(order.user);
      if (orderOwner && orderOwner.telegramChatId) {
        let statusMessage = "";
        if (newStatus === "processing") {
          statusMessage = `Halo ${orderOwner.name}, order Joki *${order.service}* kamu *sedang dikerjakan🚀*. Santai aja, kami lagi bekerja keras buat kamu!`;
        } else if (newStatus === "completed") {
          statusMessage = `Selamat ${orderOwner.name}, order Joki *${order.service}* kamu sudah *selesai!🥳* Silakan cek hasilnya.`;
        } else if (newStatus === "cancelled") {
          statusMessage = `Maaf ${orderOwner.name}, order Joki *${order.service}* kamu *dibatalkan😥*. Cek kembali order kamu ya!`;
        }

        if (statusMessage) {
          await sendTelegramNotification(orderOwner.telegramChatId, statusMessage, "Markdown");
        }
      } else {
        console.log("User belum menghubungkan akun Telegram.");
      }
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE ORDER
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    if (req.user.role !== "admin" && order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Tidak diizinkan" });
    }

    await order.deleteOne();
    res.json({ message: "Order berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  downloadFile,
  updateOrder,
  deleteOrder,
};
