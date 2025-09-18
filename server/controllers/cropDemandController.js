const CropDemand = require('../models/CropDemand');
const StockedCrop = require("../models/StockedCrop");
const Farmer = require("../models/Farmer");

const { sendBulkSMS } = require("../utils/BulksmsSender");

const registerCropDemand = async (req, res) => {
  try {
    const { cropName, amount, price, contact, buyerId } = req.body;
    // console.log({ cropName, amount, price, contact, buyerId });

    // Validate required fields
    if (!cropName || !amount || !price || !contact || !buyerId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create new crop demand
    const newDemand = new CropDemand({
      cropName,
      amount,
      price,
      contact,
      buyerId,
    });

    await newDemand.save();

    // Fetch stocked crops with same cropName
    const stockedCrops = await StockedCrop.find({
      cropName: { $regex: cropName, $options: "i" }
    });

    if (stockedCrops.length > 0) {
    // Extract farmerIds
    const farmerIds = [...new Set(stockedCrops.map(crop => crop.farmerId))];
    
    // Fetch farmers
    const farmers = await Farmer.find({ _id: { $in: farmerIds } });
    // console.log(farmers);

    // Prepare SMS content
    const smsText = `📢 New Demand Alert!\n\nCrop: ${newDemand.cropName}\nAmount: ${newDemand.amount}\nPrice: ${newDemand.price}\nBuyer Contact: ${newDemand.contact}`;

    // Collect phone numbers
    const phoneNumbers = [...new Set(farmers.map(f => f.phone).filter(Boolean))];
    // console.log(phoneNumbers);
    

    // Send SMS
    if (phoneNumbers.length > 0) {
    await sendBulkSMS(phoneNumbers, smsText);
    }
  }
    res.status(201).json({
      message: 'Crop demand registered successfully and notifications sent',
      demand: newDemand
    });

  } catch (err) {
    console.error('Error registering crop demand:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Search stocked crops by cropName and sort by distance
const searchStockedCrops = async (req, res) => {
  try {
    const { cropName, geolocation } = req.body;
    console.log({ cropName, geolocation });

    if (!cropName || !geolocation || !geolocation.lat || !geolocation.lng) {
      return res
        .status(400)
        .json({ error: "Crop name and geolocation are required" });
    }

    // Find matching stocked crops
    const crops = await StockedCrop.find({
      cropName: { $regex: cropName, $options: "i" },
    }).lean();

    if (!crops.length) {
      return res.status(404).json({ message: "No crops found" });
    }

    // Enrich crops with farmer geolocation & calculate distance
    const enrichedCrops = await Promise.all(
      crops.map(async (crop) => {
        try {
          const farmer = await Farmer.findById(crop.farmerId).lean();
          if (!farmer || !farmer.geolocation) {
            return { ...crop, distance: null, farmerName: farmer?.name || "Unknown" };
          }

          const distance = getDistanceFromLatLonInKm(
            geolocation.lat,
            geolocation.lng,
            farmer.geolocation.lat,
            farmer.geolocation.lng
          );

          return { ...crop, distance, farmerName: farmer.name };
        } catch {
          return { ...crop, distance: null, farmerName: "Unknown" };
        }
      })
    );

    // Sort by nearest first (ascending distance)
    enrichedCrops.sort((a, b) => {
      if (a.distance == null) return 1;
      if (b.distance == null) return -1;
      return a.distance - b.distance;
    });

    res.json(enrichedCrops);
  } catch (err) {
    console.error("Error searching stocked crops:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Haversine formula to calculate distance in KM
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in KM
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = { registerCropDemand, searchStockedCrops };