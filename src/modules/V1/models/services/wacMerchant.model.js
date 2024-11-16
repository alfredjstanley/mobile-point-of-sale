const mongoose = require("mongoose");

const wacRefSchema = new mongoose.Schema({
  first_name: {
    type: String,
    trim: true,
    default: null,
  },
  last_name: {
    type: String,
    trim: true,
    default: null,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: null,
  },
  date_of_birth: {
    type: Date,
    default: null,
  },
  account_type: {
    type: String,
    enum: ["Standard", "Premium"],
    default: "Standard",
  },
  profile_picture: {
    type: String,
    default: null,
  },
  location: {
    type: [Number], // [longitude, latitude]
    index: "2dsphere",
  },
  product_categories: {
    type: [String],
    default: [],
  },
  post_office: {
    type: String,
    default: null,
  },
  local_body: {
    type: String,
    default: null,
  },
  taluk: {
    type: String,
    default: null,
  },
  pincode: {
    type: String,
    default: null,
  },
  working_hours: {
    type: String,
    default: null,
  },
  working_days: {
    type: [String],
    default: [],
  },
  point_balance: {
    type: Number,
    default: 0,
  },
  coupons_available: {
    type: Number,
    default: 0,
  },
});

module.exports = wacRefSchema;
