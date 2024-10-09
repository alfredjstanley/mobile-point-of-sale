const mongoose = require("mongoose");

const salesReturnSchema = new mongoose.Schema(
  {
    sale: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale",
      required: [true, "Sale reference is required"],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity cannot be less than 1"],
        },
        reason: {
          type: String,
          required: [true, "Reason for return is required"],
        },
      },
    ],
    totalRefund: {
      type: Number,
      required: [true, "Total refund amount is required"],
      min: [0, "Total refund cannot be negative"],
    },
    returnDate: {
      type: Date,
      default: Date.now,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("SalesReturn", salesReturnSchema);
