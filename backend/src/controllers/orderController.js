// controllers/orderController.js
const Order = require("../models/Order");
const User = require("../models/User");
const { put } = require('@vercel/blob'); // TAMBAHKAN INI
const sendEmail = require("../utils/sendEmail");
const { sendTelegramNotification } = require("../services/telegramNotifier");
const getFixedAmountMessage = require("../messages/fixedAmountMessage");
const Activity = require("../models/Activity");

// Import the message modules
const telegramAdminMessages = require("../messagesTelegram/telegramAdminMessages");
const telegramUserMessages = require("../messagesTelegram/telegramUserMessages");

// Helper function untuk upload file ke Vercel Blob
const uploadFileToBlob = async (file, orderId) => {
  if (!file) return null;
  
  try {
    const fileName = `order-${orderId}-${Date.now()}-${file.originalname}`;
    const blob = await put(fileName, file.buffer, {
      access: 'public',
      contentType: file.mimetype,
      addRandomSuffix: false,
    });
    
    return {
      url: blob.url,
      filename: fileName,
      originalName: file.originalname
    };
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    throw new Error('Failed to upload file');
  }
};

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    // Cek status akun user
    if (!req.user.is_active) {
      return res.status(403).json({
        message: "Akun kamu dinonaktifkan. Kamu tidak dapat membuat order.",
      });
    }

    // Ambil field dari request body
    const {
      service,
      description,
      deadline,
      phone,
      provider,
      paymentAmount, // nominal pembayaran yang diinput user
      packageName, // nama paket yang dipilih
    } = req.body;

    if (!phone || !provider || !packageName) {
      return res
        .status(400)
        .json({ message: "Nomor HP, provider, dan nama paket wajib diisi" });
    }

    // Siapkan data order, set paymentStatus default sebagai "belum dibayar"
    const orderData = {
      user: req.user._id,
      service,
      description,
      deadline,
      phone,
      provider,
      paymentAmount: paymentAmount ? Number(paymentAmount) : 0,
      packageName,
      paymentStatus: "belum dibayar", // default, admin nantinya bisa mengubahnya
    };

    // Buat order dulu untuk dapat ID
    const order = new Order(orderData);

    // Upload file ke Vercel Blob jika ada
    if (req.file) {
      const fileData = await uploadFileToBlob(req.file, order._id);
      order.file = {
        filename: fileData.filename,
        originalName: fileData.originalName,
        path: fileData.url, // Simpan URL dari Vercel Blob
      };
    }

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

    // Use the imported admin message template
    const notifMessage = telegramAdminMessages.newOrderNotification(
      {
        service,
        description,
        phone,
        provider,
        packageName,
        paymentAmount
      },
      req.user,
      formattedDeadline
    );

    await sendTelegramNotification(process.env.TELEGRAM_CHAT_ID, notifMessage);

    if (req.user.telegramChatId) {
      // Use the enhanced user message template with complete order object
      const userNotifMessage = telegramUserMessages.orderReceived(order, req.user);
      await sendTelegramNotification(
        req.user.telegramChatId,
        userNotifMessage,
        "Markdown"
      );
    } else {
      console.log("User belum menghubungkan akun Telegram.");
    }

    // Catat aktivitas order
    Activity.create({
      user: order.user,
      description: "User memesan order joki",
    }).catch((err) => console.error("Error logging order:", err));

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ORDERS (ADMIN) or ORDERS BY USER
const getOrders = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const orders = await Order.find({}).populate("user", "name email avatar");
      return res.json(orders);
    } else {
      const orders = await Order.find({ user: req.user._id }).populate(
        "user",
        "name email avatar"
      );
      return res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE ORDER
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email avatar"
    );
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

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
};

// DOWNLOAD FILE - Redirect ke Blob URL
const downloadFile = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });
    if (!order.file)
      return res.status(404).json({ message: "File tidak ditemukan" });

    if (
      req.user.role !== "admin" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Tidak diizinkan" });
    }

    // Redirect ke URL Vercel Blob
    res.redirect(order.file.path);
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

    if (
      req.user.role !== "admin" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Tidak diizinkan" });
    }

    const originalStatus = order.status;

    // Update field-field order
    order.service = req.body.service ?? order.service;
    order.description = req.body.description ?? order.description;
    order.deadline = req.body.deadline ?? order.deadline;

    // Jika ada perubahan status
    const newStatus = req.body.status ?? order.status;
    if (newStatus === "completed" && order.status !== "completed") {
      order.completedAt = new Date();
    } else if (newStatus !== "completed") {
      order.completedAt = null;
    }
    order.status = newStatus;

    // Update field baru jika dikirim oleh admin
    if (req.body.paymentStatus) {
      order.paymentStatus = req.body.paymentStatus;
    }
    if (req.body.paymentAmount) {
      order.paymentAmount = Number(req.body.paymentAmount);
    }
    if (req.body.packageName) {
      order.packageName = req.body.packageName;
    }

    // Upload file baru jika ada
    if (req.file) {
      const fileData = await uploadFileToBlob(req.file, order._id);
      order.file = {
        filename: fileData.filename,
        originalName: fileData.originalName,
        path: fileData.url, // Simpan URL dari Vercel Blob
      };
    }

    const updatedOrder = await order.save();

    // Kirim notifikasi ke user jika admin yang melakukan update dan status order berubah
    if (req.user.role === "admin" && newStatus !== originalStatus) {
      let orderOwner = await User.findById(order.user);
      if (orderOwner && orderOwner.telegramChatId) {
        // Use the enhanced status update message with complete order details
        const statusMessage = telegramUserMessages.orderStatusUpdate(
          orderOwner.name,
          updatedOrder
        );

        if (statusMessage) {
          await sendTelegramNotification(
            orderOwner.telegramChatId,
            statusMessage,
            "Markdown"
          );
        }
      } else {
        console.log("User belum menghubungkan akun Telegram.");
      }
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: error.message });
  }
};

const fixedAmount = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("user");
    if (!order) {
      return res.status(404).json({ error: "Order tidak ditemukan" });
    }
    order.fixedAmount = Number(req.body.fixedAmount);
    await order.save();

    // Kirim notifikasi email ke user
    if (order.user && order.user.email) {
      // Gunakan fungsi sendEmail dengan template dari getFixedAmountMessage
      const emailContent = getFixedAmountMessage(order);

      const textContent = `Halo,
      
Nominal fixed pembayaran untuk order kamu telah di-set menjadi ${telegramUserMessages.formatCurrency(order.fixedAmount)}.

Silakan selesaikan pembayaran sesuai nominal tersebut.

Terima kasih.`;

      sendEmail(
        order.user.email,
        "Update Nominal Pembayaran Order",
        emailContent,
        textContent
      );
      
      // Kirim notifikasi Telegram jika user memiliki chatId
      if (order.user.telegramChatId) {
        const notifMessage = telegramUserMessages.fixedAmountSet(
          order.user.name,
          order
        );
        
        await sendTelegramNotification(
          order.user.telegramChatId,
          notifMessage,
          "Markdown"
        );
      }

      // Buat log aktivitas jika diperlukan
      await Activity.create({
        type: "ORDER_FIXED_AMOUNT",
        user: req.user._id,
        order: order._id,
        description: `Fixed amount set to ${telegramUserMessages.formatCurrency(order.fixedAmount)}`,
      });
    }

    res.json(order);
  } catch (error) {
    console.error("Error update fixed amount:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updatePayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("user");
    if (!order) {
      return res.status(404).json({ error: "Order tidak ditemukan" });
    }

    const additionalPayment = Number(req.body.payment);
    if (isNaN(additionalPayment) || additionalPayment <= 0) {
      return res.status(400).json({ error: "Input pembayaran tidak valid" });
    }

    // Cek apakah pembayaran tambahan melebihi sisa pembayaran
    const remaining = order.fixedAmount - order.paymentAmount;
    if (additionalPayment > remaining) {
      return res
        .status(400)
        .json({ error: `Pembayaran melebihi sisa pembayaran: ${remaining}` });
    }

    // Update paymentAmount
    const previousPaymentAmount = order.paymentAmount;
    order.paymentAmount += additionalPayment;

    // Update status payment
    if (order.paymentAmount >= order.fixedAmount) {
      order.paymentStatus = "lunas";
    } else {
      order.paymentStatus = "dicicil";
    }

    await order.save();
    
    // Kirim notifikasi Telegram ke user
    if (order.user && order.user.telegramChatId) {
      const notifMessage = telegramUserMessages.paymentUpdated(
        order.user.name,
        order,
        additionalPayment
      );
      
      await sendTelegramNotification(
        order.user.telegramChatId,
        notifMessage,
        "Markdown"
      );
    }

    // Buat log aktivitas
    await Activity.create({
      type: "PAYMENT_UPDATED",
      user: req.user._id,
      order: order._id,
      description: `Payment updated from ${telegramUserMessages.formatCurrency(previousPaymentAmount)} to ${telegramUserMessages.formatCurrency(order.paymentAmount)}`,
    });

    res.json(order);
  } catch (error) {
    console.error("Error update payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE ORDER
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

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
};

// DELETE ALL ORDERS (ADMIN ONLY)
const deleteAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(401).json({
        message: "Tidak diizinkan, hanya admin yang bisa hapus semua order",
      });
    }
    await Order.deleteMany({});
    res.json({ message: "Semua order berhasil dihapus" });
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
  fixedAmount,
  updatePayment,
  deleteOrder,
  deleteAllOrders,
};