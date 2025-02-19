const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const routes = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Koneksi ke MongoDB
connectDB();

// Routing
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
