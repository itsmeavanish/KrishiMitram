const StoreOwner = require('../models/StoreOwner');

const searchStores = async (req, res) => {
    console.log(req.body);
    
  const { storeType = "", geolocation,search } = req.body;
//   console.log({ storeType, geolocation });

  if (!geolocation || !geolocation.lat || !geolocation.lng) {
    return res.status(400).json({ error: "Geolocation required" });
  }

  try {
    // Find matching stores by type only
//     const stores = await StoreOwner.find({
//   storetype: new RegExp(`^${storeType}$`, "i") 
// }).lean();

// let query = { storetype: storeType };
let query = { storetype: new RegExp(`^${storeType}$`, "i") };

if (search && search.trim() !== "") {
  query.storeName = { $regex: search, $options: "i" }; // add only if search provided
}

const stores = await StoreOwner.find(query).lean();


    console.log("Stores found count:", stores.length);

    // Calculate distance from user
    const storesWithDistance = stores.map((store) => {
      const lat2 = store.geolocation.lat;
      const lng2 = store.geolocation.lng;
      const distance = getDistanceFromLatLonInKm(
        geolocation.lat,
        geolocation.lng,
        lat2,
        lng2
      );
      return { ...store, distance };
    });

    // Sort by nearest first
    storesWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(storesWithDistance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Haversine
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

module.exports = { searchStores };
