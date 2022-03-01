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
    type: Number,
    default: 0,
  },
  inCart: {
    type: Boolean,
    default: false,
  },
});

const listSchema = mongoose.Schema({
  listName: {
    type: String,
    required: true,
  },
  date_created: {
    type: String,
    required: true,
    default: () => moment().format('DD/MM/YYYY HH:mm'),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  products: {
    type: [productSchema],
  },
  active: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('List', listSchema);
