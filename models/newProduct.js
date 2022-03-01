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
  department: {
    type: String,
  },
  date_added: {
    type: String,
    required: true,
    default: () => moment().format('DD/MM/YYYY HH:mm'),
  },
  amount: {
    type: Boolean,
    default: 0,
  },
});

module.exports = mongoose.model('Product', productSchema);
