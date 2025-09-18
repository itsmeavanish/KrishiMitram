const mongoose = require('mongoose');

const StockedCropSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  amount: { type: Number, required: true }, // in kilograms
  price: { type: Number, required: true },  // total price in INR
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  contactOfFarmer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Automatically update updatedAt on save
StockedCropSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('StockedCrop', StockedCropSchema);
