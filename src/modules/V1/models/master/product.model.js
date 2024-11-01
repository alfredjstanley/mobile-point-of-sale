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
      ref: "AuthUser",
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

productSchema.pre("save", async function (next) {
  const Category = mongoose.model("Category");
  const Unit = mongoose.model("Unit");
  const Tax = mongoose.model("Tax");

  const [isCategoryValid, isUnitValid, isTaxValid] = await Promise.all([
    Category.exists({ _id: this.category, storeId: this.storeId }),
    Unit.exists({ _id: this.unit }),
    Tax.exists({ _id: this.tax }),
  ]);

  if (!isCategoryValid) return next(new Error("Invalid Category ID"));
  if (!isUnitValid) return next(new Error("Invalid Unit ID"));
  if (!isTaxValid) return next(new Error("Invalid Tax ID"));

  next();
});

module.exports = mongoose.model("Product", productSchema);
