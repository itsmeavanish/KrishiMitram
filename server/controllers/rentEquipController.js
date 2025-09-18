const RentEquipment = require('../models/RentEquipment');

const searchRentEquipment = async (req, res) => {
  const { search, type, geolocation } = req.body;
  console.log({ search, type, geolocation });

  if (!geolocation || !geolocation.lat || !geolocation.lng) {
    return res.status(400).json({ error: 'Geolocation required' });
  }

  try {
    // Build query
    let query = {};

    if (type && type.trim() !== "") {
      query.type = type;
    }

    if (search && search.trim() !== "") {
      query.equipmentName = { $regex: search, $options: "i" };
    }

    // Find matching equipment
    const equipments = await RentEquipment.find(query).lean();
    console.log(equipments.length);
    // Add distance calculation
    const equipmentsWithDistance = equipments.map((eq) => {
      const lat2 = eq.geolocation.lat;
      const lng2 = eq.geolocation.lng;
      const distance = getDistanceFromLatLonInKm(
        geolocation.lat,
        geolocation.lng,
        lat2,
        lng2
      );
      return { ...eq, distance: Number(distance.toFixed(2)) }; // round to 2 decimals
    });

    // Sort by nearest first
    equipmentsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(equipmentsWithDistance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
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

const registerEquipment = async (req, res) => {
  try {
    const {
      equipmentName,
      type,
      rate,
      description,
      ownerName,
      ownerId,
      contact,
      geolocation,
    } = req.body;
    console.log({
      equipmentName,
      type,
      rate,
      description,
      ownerName,
      ownerId,
      contact,
      geolocation,
    });
    // Validate required fields
    if (
      !equipmentName ||
      !type ||
      !rate?.amount ||
      !rate?.unit ||
      !ownerName ||
      !ownerId ||
      !contact ||
      !geolocation?.lat ||
      !geolocation?.lng
    ) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    // Create new equipment document
    const newEquipment = new RentEquipment({
      equipmentName,
      type,
      rate,
      description,
      ownerName,
      ownerId,
      contact,
      geolocation,
    });

    await newEquipment.save();

    res.status(201).json({
      message: "Equipment registered successfully",
      equipment: newEquipment,
    });
  } catch (err) {
    console.error("Error registering equipment:", err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = { searchRentEquipment, registerEquipment };
