// server.js
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Chat API endpoint (gateway to Python backend)
app.post("/api/chat", async (req, res) => {
  try {
    // Forward the request to Python FastAPI
    const response = await axios.post("http://localhost:8000/api/chat", req.body);

    // Send Python's response back to frontend
    res.json(response.data);
  } catch (error) {
    console.error("Error communicating with Python backend:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to connect to chatbot service",
    });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("✅ Node Gateway is running");
});

app.listen(PORT, () => {
  console.log(`🚀 Node Gateway running at http://localhost:${PORT}`);
});
