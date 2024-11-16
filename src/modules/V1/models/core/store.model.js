const mongoose = require("mongoose");
const wacRefSchema = require("../services/wacMerchant.model");

const storeSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      trim: true,
      default: null,
      maxlength: [100, "Store name cannot exceed 100 characters"],
    },
    storeNumber: {
      type: Number,
      unique: true,
      required: [true, "Store number is required"],
    },
    phoneNumber: {
      type: String,
      match: [
        /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
        "Please enter a valid phone number.",
      ],
      default: null,
    },
    merchantName: {
      type: String,
      trim: true,
      default: null,
      maxlength: [100, "Merchant name cannot exceed 100 characters"],
    },
    storeType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StoreType",
      default: null,
    },

    gstNumber: {
      default: null,
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/,
        "Please enter a valid email",
      ],
      default: null,
    },
    address: {
      street: { type: String, default: null },
      city: { type: String, default: null },
      postalCode: { type: String, default: null },
      district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "District",
        default: null,
      },
      state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
        default: null,
      },
      country: {
        type: String,
        default: "India",
      },
    },

    website: {
      type: String,
      match: [
        /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*$/,
        "Please enter a valid URL",
      ],
      default: null,
    },
    status: {
      type: String,
      required: true,
      enum: ["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED", "DELETED"],
    },
    aboutStore: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    existsInWac: { type: Boolean, default: false },
    wacRef: {
      type: wacRefSchema,
      default: null,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Store", storeSchema);
