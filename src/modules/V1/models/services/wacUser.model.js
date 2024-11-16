const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    default: null,
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    default: null,
  },
});

module.exports = new mongoose.Schema({
  first_name: {
    type: String,
    default: null,
  },
  last_name: {
    type: String,
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
  email: {
    type: String,
    default: null,
    lowercase: true,
    default: null,
  },
  mobile_number: {
    type: String,
    default: null,
  },
  registration_status: {
    type: String,
    enum: ["completed", "pending", "failed"],
    default: "pending",
  },
  profile_picture: {
    type: String,
    default: null,
  },
  location: locationSchema,
  address: {
    type: String,
    default: null,
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
  district: {
    type: String,
    default: null,
  },
  state: {
    type: String,
    default: null,
  },
  country: {
    type: String,
    default: "India",
  },
  pincode: {
    type: String,
    default: null,
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
