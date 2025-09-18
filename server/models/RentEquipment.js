const mongoose = require('mongoose');

const RentEquipmentSchema = new mongoose.Schema({
  equipmentName: { type: String, required: true },
  type: { type: String, required: true },
  rate: {
    amount: { type: Number, required: true },
    unit: { type: String, enum: ['per hour', 'per day'], required: true }
  },
  description: { type: String },
  ownerName: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  contact: { type: String, required: true },
  geolocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: { type: String, enum: ['available', 'rented'], default: 'available' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Optional: update updatedAt on document save
RentEquipmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('RentEquipment', RentEquipmentSchema);
