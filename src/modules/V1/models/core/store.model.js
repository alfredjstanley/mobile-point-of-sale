const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      match: [
        /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
        "Please enter a valid phone number.",
      ],
      default: null,
    },
    businessName: {
      type: String,
      trim: true,
      default: null,
      maxlength: [100, "Business name cannot exceed 100 characters"],
    },
    legalName: {
      type: String,
      trim: true,
      default: null,
      maxlength: [100, "Legal name cannot exceed 100 characters"],
    },
    taxId: {
      type: String,
      trim: true,
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
        default: null,
      },
    },
    bankDetails: {
      accountName: { type: String, default: null },
      accountNumber: { type: String, default: null },
      bankName: { type: String, default: null },
      swiftCode: { type: String, default: null },
    },
    operationalHours: [
      {
        day: { type: String, default: null },
        openTime: { type: String, default: null },
        closeTime: { type: String, default: null },
      },
    ],
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
    logo: { type: String, default: null },
    description: { type: String, default: null },
    categories: [String],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Store", storeSchema);
