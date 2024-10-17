const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    mobileNumber: {
      type: String,
      trim: true,
      match: [/^\+91\s?[6-9]\d{9}$/, "Please enter a valid phone number"],
    },
    credit: {
      type: Number,
      default: 0,
      min: [0, "Credit cannot be negative"],
    },
    creditLimit: {
      type: Number,
      default: 0,
      min: [0, "Credit limit cannot be negative"],
    },
    creditDuration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1"],
      comment: "Duration in days/months/years depending on context",
    },
    accountType: {
      type: String,
      required: [true, "Account type is required"],
      enum: ["CUSTOMER", "SUPPLIER"],
    },
    isDebit: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Account", accountSchema);
