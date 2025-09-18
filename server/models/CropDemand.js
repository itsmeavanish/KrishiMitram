const mongoose = require('mongoose');

const CropDemandSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  amount: { type: Number, required: true }, // in kilograms
  price: { type: Number, required: true },  // total price in INR
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true },
  contact: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Automatically update updatedAt on save
CropDemandSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CropDemand', CropDemandSchema);
