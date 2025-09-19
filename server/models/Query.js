const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
  query: {
    type: String, // query body from farmer
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmer", // reference to Farmer model
    required: true,
  },
  role: {
    type: String,
    default: "farmer",
    immutable: true,
  },
  geolocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },

  // officer’s reply
  answer: { type: String },
  answeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AgriOfficer",
  },
  answeredAt: { type: Date },

}, { timestamps: true });

const Query = mongoose.model("Query", querySchema);

module.exports = Query;
