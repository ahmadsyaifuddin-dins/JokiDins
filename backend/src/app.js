const express = require("express");
const cors = require("cors");
const useragent = require("express-useragent");
require("dotenv").config();
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/order");
const telegramToken = require("./routes/telegram");  
const telegramWebhook = require("./routes/telegramWebhook");
const activityRoutes = require("./routes/activity");
const pendapatanRoutes = require("./routes/pendapatan");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoute = require('./routes/uploadRoutes');

const app = express();

const corsOptions = {
  origin: [
    'https://jokidins-backend.vercel.app',
    'https://jokidins.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(useragent.express());

// Koneksi ke MongoDB
connectDB();

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);

// Mount kedua endpoint Telegram di base path yang sama:
app.use("/api/telegram", telegramToken);
app.use("/telegram", telegramWebhook);

// Route untuk admin untuk melihat aktivitas pengguna
app.use("/api/user/activity", activityRoutes);

app.use("/api/pendapatan", pendapatanRoutes);

// Rute upload
app.use('/avatar', uploadRoute);

// Contoh route lain (misalnya route utama)
app.get("/", (req, res) => {
  res.send("API JokiDins Running...");
});

// Export app untuk Vercel (serverless)
module.exports = app;