const CropDemand = require('../models/CropDemand');
const StockedCrop = require('../models/StockedCrop');
const Buyer = require('../models/Buyer');
const { sendBulkSMS } = require("../utils/BulksmsSender");

const searchCropDemand = async (req, res) => {
  try {
    const { cropName, geolocation } = req.body;
    console.log({ cropName, geolocation });

    if (!cropName || !geolocation || !geolocation.lat || !geolocation.lng) {
      return res.status(400).json({ error: "Crop name and geolocation are required" });
    }

    // Find buyer demands for this crop
    const demands = await CropDemand.find({
      cropName: { $regex: cropName, $options: "i" },
    }).lean();

    console.log(demands.length);
    if (!demands.length) {
      return res.status(404).json({ message: "No buyers found for this crop" });
    }

    // Enrich demands with buyer geolocation, name & calculate distance
    const enrichedDemands = await Promise.all(
      demands.map(async (demand) => {
        try {
          const buyer = await Buyer.findById(demand.buyerId).lean();
          if (!buyer || !buyer.geolocation) {
            return {
              ...demand,
              distance: null,
              buyerName: buyer ? buyer.name : "Unknown"
            };
          }

          const distance = getDistanceFromLatLonInKm(
            geolocation.lat,
            geolocation.lng,
            buyer.geolocation.lat,
            buyer.geolocation.lng
          );

          return {
            ...demand,
            distance,
            buyerName: buyer.name
          };
        } catch {
          return { ...demand, distance: null, buyerName: "Unknown" };
        }
      })
    );

    // Sort: first by distance ASC, then by price DESC
    enrichedDemands.sort((a, b) => {
      // Handle null distances
      if (a.distance == null) return 1;
      if (b.distance == null) return -1;

      if (a.distance !== b.distance) {
        return a.distance - b.distance; // ascending distance
      } else {
        return b.price - a.price; // descending price if distance equal
      }
    });

    res.json(enrichedDemands);
  } catch (err) {
    console.error("Error searching crop demand:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}




const registerStockedCrop = async (req, res) => {
  try {
    const { cropName, amount, price, farmerId, contactOfFarmer } = req.body;

    // Basic validation
    if (!cropName || !amount || !price || !farmerId || !contactOfFarmer) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create new stocked crop
    const newCrop = new StockedCrop({
      cropName,
      amount,
      price,
      farmerId,
      contactOfFarmer,
    });

    const savedCrop = await newCrop.save();

    // ✅ After saving, search for matching crop demands
    const demands = await CropDemand.find({
      cropName: { $regex: new RegExp(cropName, "i") }
    });

    if (demands.length > 0) {
      // Extract farmer IDs from demands
      const buyerIDs = demands.map((d) => d.buyerId);

      // Fetch farmer details
      const buyers = await Buyer.find({ _id: { $in: buyerIDs } });

      // Get phone numbers (clean + unique)
      const phoneNumbers = [
        ...new Set(buyers.map((b) => b.phone).filter(Boolean)),
      ];
      
      // console.log(phoneNumbers);

      if (phoneNumbers.length > 0) {
        const message = `📢 Fresh stock alert! ${cropName} is now available at ₹${price}/unit. Contact the farmer directly at ${contactOfFarmer} to buy.`;
        await sendBulkSMS(phoneNumbers, message);
      }
    }

    res.status(201).json({
      message: "Crop registered successfully",
      crop: savedCrop,
    });
  } catch (err) {
    console.error("Error registering stocked crop:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { searchCropDemand, registerStockedCrop };
