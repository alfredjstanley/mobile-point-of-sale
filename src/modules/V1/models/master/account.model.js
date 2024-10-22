const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      trim: true,
      default: "",
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
      default: 0,
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
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth",
      required: true,
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

accountSchema.index({ phone: 1, storeId: 1 }, { unique: true });

module.exports = mongoose.model("Account", accountSchema);
