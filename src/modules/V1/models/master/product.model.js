const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    sellingPrice: {
      type: Number,
      required: [true, "Selling price is required"],
    },
    stockQuantity: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: [true, "Unit is required"],
    },
    tax: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tax",
      required: [true, "Tax is required"],
    },
    taxIncluded: {
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
      required: true,
      ref: "User",
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "AuthUser",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
productSchema.index({ name: 1, storeId: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);
