const express = require('express');
const router = express.Router();

const { searchStores } = require('../controllers/storeController');
const { searchRentEquipment,registerEquipment } = require('../controllers/rentEquipController');
const { searchCropDemand, registerStockedCrop } = require('../controllers/sellCropController');
const { registerCropDemand, searchStockedCrops } = require('../controllers/cropDemandController');

// const { registerStockedCrop } = require('../controllers/stockedCropsController');

// Store search
router.post('/stores/search', searchStores);

// Rent Equipment search
router.post('/rentequipment/search', searchRentEquipment);
router.post("/equipment/register", registerEquipment);
router.post("/buyers/search", searchCropDemand);
router.post("/crop/register", registerStockedCrop);
router.post("/cropdemand/register", registerCropDemand);
router.post("/stockedcrops/search", searchStockedCrops);

// Stocked crop registration
// router.post('/stockedcrops', registerStockedCrop);

// Add more marketplace routes here if needed

module.exports = router;
