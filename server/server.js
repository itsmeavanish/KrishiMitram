const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require("cookie-parser");

// Import all marketplace routes from one file
const marketRoutes = require('./routes/marketRoutes');
const authRoutes = require("./routes/authRoutes");
// const qnaRoutes=require('./routes/qnaRoutes');
// const userRoutes=require('./routes/userRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // Adjust as needed
  credentials: true,
}));
app.use(express.json());

// Connect Database
connectDB();

app.use('/api', marketRoutes);
app.use('/api/auth', authRoutes);
// app.use("/api/qna", qnaRoutes);
// app.use("/api/users",userRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Server is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
