const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // 🔥 Needed to parse JSON request bodies

// Routes
app.use("/api/auth", require("./routes/auth"));

// Connect DB
connectDB();

app.get("/", (req, res) => {
  res.send("✅ Auth backend is running. Visit /api/auth for routes.");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
