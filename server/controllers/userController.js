const Farmer = require("../models/Farmer");
const Buyer = require("../models/Buyer");
const Officer = require("../models/Officer");
const StoreOwner = require("../models/StoreOwner");

// GET all users (farmers, buyers, officers, storeowners)
const getAllUsers = async (req, res) => {
  try {
    const farmers = await Farmer.find().select("-password"); // exclude password
    const buyers = await Buyer.find().select("-password");
    const officers = await Officer.find().select("-password");
    const storeOwners = await StoreOwner.find().select("-password");

    // merge all users into one array
    const allUsers = [
      ...farmers,
      ...buyers,
      ...officers,
      ...storeOwners,
    ];
console.log(allUsers);

    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllUsers };
