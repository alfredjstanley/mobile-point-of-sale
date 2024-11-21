const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
  {
    userMobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    merchantMobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    paymentDetails: {
      invoice_id: { type: String, required: true },
      amount: { type: Number, required: true },
      payment_mode: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILURE"],
      required: true,
    },
    errorMessage: {
      type: String,
      default: null, // Stores error messages in case of failure
    },
    response: {
      type: Object,
      default: null, // Stores the API response if successful
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", LogSchema);
