const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

// Import route autentikasi dan user
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/order");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi ke MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use('/uploads', express.static('uploads'));

// Contoh route lain (misalnya route utama)
app.get("/", (req, res) => {
  res.send("API JokiDins Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
