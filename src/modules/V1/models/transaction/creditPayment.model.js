const mongoose = require("mongoose");

const creditPaymentSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store ID is required"],
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Customer ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ["CASH", "CARD", "UPI", "OTHER"],
      required: [true, "Payment method is required"],
    },
    reference: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
      required: [true, "User ID is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

creditPaymentSchema.index({ storeId: 1, customer: 1 });

module.exports = mongoose.model("CreditPayment", creditPaymentSchema);
