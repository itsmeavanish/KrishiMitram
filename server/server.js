const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require('./config/db');

// Import all routes
const marketRoutes = require('./routes/marketRoutes');
const authRoutes = require("./routes/authRoutes");
const qnaRoutes = require('./routes/qnaRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: '*', // Change this in production if needed
  credentials: true,
}));
app.use(express.json());

// Connect Database
connectDB();

// API routes
app.use('/api', marketRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/qna", qnaRoutes);
app.use("/api/users", userRoutes);
app.get("/api/auth/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ msg: "Not authenticated" });
  }
  res.json({ token });
});

// // Serve frontend in production
// if (process.env.NODE_ENV === 'production') {
//   const frontendPath = path.join(__dirname, '../krishimitram/.next'); // Path to frontend build
//   app.use(express.static(frontendPath));

//   // All other requests send index.html
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(frontendPath, 'index.html'));
//   });
// }

// Health check
// app.get('/health', (req, res) => {
//   res.send('Server is running...');
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
