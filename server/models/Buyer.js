const mongoose = require('mongoose');

const BuyerSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // 🔑 added password
  role: { type: String, default: 'buyer' },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  company: { type: String, required: true },
  GSTno: { type: String },
  PAN: { type: String },
  geolocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }
});

module.exports = mongoose.model('Buyer', BuyerSchema);
