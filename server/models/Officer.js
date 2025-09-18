const mongoose = require('mongoose');

const OfficerSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // 🔑 added password
  role: { type: String, default: 'officer' },
  name: { type: String, required: true },
  email: { type: String },
  contact: { type: String },
  employeeId: { type: String, required: true },
  department: { type: String },
  post: { type: String },
  division: { type: String },
  geolocation: {
    lat: { type: Number },
    lng: { type: Number }
  }
});

module.exports = mongoose.model('Officer', OfficerSchema);
