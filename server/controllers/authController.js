const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Import your models
const Farmer = require('../models/Farmer');
const Officer = require('../models/Officer');
const Buyer = require('../models/Buyer');
const StoreOwner = require('../models/StoreOwner');

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Helper: choose model based on role
const getModelByRole = (role) => {
  switch (role) {
    case 'farmer': return Farmer;
    case 'officer': return Officer;
    case 'buyer': return Buyer;
    case 'storeowner': return StoreOwner;
    default: throw new Error('Invalid role');
  }
};

// ✅ Register Controller
exports.register = async (req, res) => {
  try {
    const { role, password,email, ...userData } = req.body;
    console.log({ role, password,email, ...userData });
    // console.log(req.body);
    
    
    const Model = getModelByRole(role);

    // Check if user already exists
    const existingUser = await Model.findOne({ email });
    console.log('h1',existingUser);
    
    if (existingUser) {
      console.log('user found');
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new Model({
      ...userData,
      role,
      email,
      password: hashedPassword,
      
    });
    
    console.log('hi1');
    await newUser.save();
    console.log(newUser);

    // Create JWT
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ msg: 'User registered successfully', token });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// ✅ Login Controller
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // List of all models
//     const models = [
//       { model: Farmer, role: "farmer" },
//       { model: Officer, role: "officer" },
//       { model: Buyer, role: "buyer" },
//       { model: StoreOwner, role: "storeowner" }
//     ];

//     let user = null;
//     let userRole = null;

//     // Search in each model by email
//     for (const { model, role } of models) {
//       const foundUser = await model.findOne({ email });
//       if (foundUser) {
//         user = foundUser;
//         userRole = role;
//         break; // stop after finding the first match
//       }
//     }

//     if (!user) {
//       return res.status(400).json({ msg: "User not found" });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password || "");
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     // Create JWT
//     const token = jwt.sign(
//       { id: user._id, role: userRole },
//       JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.status(200).json({ msg: "Login successful", token, role: userRole });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const models = [
      { model: Farmer, role: "farmer" },
      { model: Officer, role: "officer" },
      { model: Buyer, role: "buyer" },
      { model: StoreOwner, role: "storeowner" }
    ];

    let user = null;
    let userRole = null;

    for (const { model, role } of models) {
      const foundUser = await model.findOne({ email });
      if (foundUser) {
        user = foundUser;
        userRole = role;
        break;
      }
    }

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { user },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Send token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,       // not accessible via JS (XSS protection)
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "none",   // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ msg: "Login successful", role: userRole });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};