// --- Imports ---
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const SensorData = require("./models/SensorData");

// --- Create Express app ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(express.json());
app.use(cors());

// --- Test route ---
app.get("/", (req, res) => {
  res.json({ message: "Backend API is running!" });
});

// --- MongoDB connection ---
mongoose.connect(process.env.MONGO_URI || "mongodb://mongo:27017/predictive_maintenance")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// --- Sensor data route ---
app.post("/api/data", async (req, res) => {
  try {
    console.log("📩 Incoming data:", req.body);

    const { deviceId, temperature, vibration } = req.body;

    // ✅ Input validation
    if (!deviceId || temperature == null || vibration == null) {
      return res.status(400).json({ error: "Missing required fields (deviceId, temperature, vibration)" });
    }

    // ✅ Save to MongoDB
    const data = new SensorData({ deviceId, temperature, vibration });
    await data.save();

    // ✅ Send to AI model container for prediction
    const aiResponse = await axios.post("http://ai_model:8000/predict", {
      temperature,
      vibration
    });

    // ✅ Send back response
    res.status(201).json({
      message: "Data saved successfully!",
      predicted_remaining_life: aiResponse.data.predicted_remaining_life
    });

  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: "Failed to save data" });
  }
});

// --- Start server ---
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
