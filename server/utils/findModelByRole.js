const Farmer = require('../models/Farmer');
const StoreOwner = require('../models/StoreOwner');
const Buyer = require('../models/Buyer');
const Officer = require('../models/Officer');

function getModel(role) {
  switch ((role || '').toLowerCase()) {
    case 'farmer': return Farmer;
    case 'storeowner': return StoreOwner;
    case 'buyer': return Buyer;
    case 'officer': return Officer;
    default: return null;
  }
}

module.exports = getModel;
