const mongoose = require('mongoose');

const StoreOwnerSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // 🔑 added password
  role: { type: String, default: 'storeowner' },
  ownerName: String,
  storeName: String,
  GSTno: String,
  storetype: { type: String, enum: ['equipment store', 'pesticide fertilizer store'] },
  storesize: { type: String, enum: ['small', 'wholeseller', 'retailer'] },
  contact: String,
  geolocation: {
    lat: Number,
    lng: Number
  }
});

module.exports = mongoose.model('StoreOwner', StoreOwnerSchema);
