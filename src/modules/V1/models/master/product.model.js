const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    productCode: {
      type: String,
      required: [true, "Product code is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    sellingPrice: {
      type: Number,
      required: [true, "Selling price is required"],
    },
    purchaseCost: {
      type: Number,
      required: [true, "Purchase cost is required"],
    },
    margin: {
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
      type: Number,
      required: [true, "Tax is required"],
    },
    taxIncluded: {
      type: Boolean,
      default: false,
    },
    isInterTax: {
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

// Pre-save hook to calculate margin
productSchema.pre("save", function (next) {
  if (this.sellingPrice != null && this.purchaseCost != null) {
    this.margin = this.sellingPrice - this.purchaseCost;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
