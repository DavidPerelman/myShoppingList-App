const mongoose = require('mongoose');
const Product = require('./product');
const moment = require('moment-timezone');

const listSchema = new mongoose.Schema({
  listName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
    default: () => moment().format('DD/MM/YYYY hh:mm'),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      amount: {
        type: Number,
        required: true,
        default: 1,
      },
      inCart: {
        type: Boolean,
        required: true,
        default: false,
      },
      date_added: {
        type: String,
        required: true,
        default: () => moment().format('DD/MM/YYYY hh:mm'),
      },
    },
    // {
    //   amount: {
    //     type: Number,
    //     required: true,
    //     default: 0,
    //   },
    //   inCart: {
    //     type: Number,
    //     required: true,
    //     default: 0,
    //   },
    //   date_added: {
    //     type: String,
    //     required: true,
    //     default: () => moment().format('DD/MM/YYYY hh:mm'),
    //   },
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Product',
    // },
  ],
  // products: [
  //   {
  //     product: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: 'Product',
  //     },
  //     amount: {
  //       type: Number,
  //       required: true,
  //       default: 0,
  //     },
  //     inCart: {
  //       type: Number,
  //       required: true,
  //       default: 0,
  //     },
  //     date_added: {
  //       type: String,
  //       required: true,
  //       default: () => moment().format('DD/MM/YYYY hh:mm'),
  //     },
  //   },
  // ],
  active: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('List', listSchema);
