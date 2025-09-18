const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // 🔑 added password
  role: { type: String, default: 'farmer' },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  geolocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }
});

module.exports = mongoose.model('Farmer', FarmerSchema);
