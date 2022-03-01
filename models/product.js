const mongoose = require('mongoose');
const moment = require('moment-timezone');

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  product_price: {
    type: String,
  },
  date: {
    type: String,
    required: true,
    default: () => moment().format('DD/MM/YYYY hh:mm'),
  },
});

module.exports = mongoose.model('Product', productSchema);
