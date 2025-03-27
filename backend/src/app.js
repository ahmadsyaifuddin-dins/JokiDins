const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

// Import route autentikasi dan user
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

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi ke MongoDB
connectDB();

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use('/uploads/order', express.static('uploads/order'));
app.use('/uploads/avatar', express.static('uploads/avatar'));

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
