const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://avanishupadhyay633:2jqrvQmQwiOgLslp@cluster0.c80t1.mongodb.net/KrishiSathi?retryWrites=true&w=majority&appName=Cluster0");
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
