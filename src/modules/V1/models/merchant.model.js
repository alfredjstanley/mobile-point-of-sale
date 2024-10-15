const mongoose = require("mongoose");

const merchantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth",
      required: true,
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
      unique: true,
      trim: true,
    },
    gstNumber: {
      type: String,
      unique: true,
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
    contactNumber: {
      type: String,
      match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    website: {
      type: String,
      match: [
        /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*$/,
        "Please enter a valid URL",
      ],
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"],
      default: "PENDING",
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

merchantSchema.index({ businessName: 1 });
merchantSchema.index({ gstNumber: 1 });

module.exports = mongoose.model("Merchant", merchantSchema);
