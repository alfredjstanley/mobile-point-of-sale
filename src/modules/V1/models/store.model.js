const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      match: [
        /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
        "Please enter a valid phone number.",
      ],
    },
    businessName: {
      type: String,
      trim: true,
      maxlength: [100, "Business name cannot exceed 100 characters"],
    },
    legalName: {
      type: String,
      trim: true,
      maxlength: [100, "Legal name cannot exceed 100 characters"],
    },
    taxId: {
      type: String,
      trim: true,
    },
    gstNumber: {
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
    },
    address: {
      street: String,
      city: String,
      postalCode: String,
      district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "District",
      },
      state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
      },
      country: {
        type: String,
        default: "India",
      },
    },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankName: String,
      swiftCode: String,
    },
    operationalHours: [
      {
        day: String,
        openTime: String,
        closeTime: String,
      },
    ],
    website: {
      type: String,
      match: [
        /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*$/,
        "Please enter a valid URL",
      ],
    },
    status: {
      type: String,
      required: true,
      enum: ["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"],
    },
    logo: String,
    description: String,
    categories: [String],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Store", storeSchema);
