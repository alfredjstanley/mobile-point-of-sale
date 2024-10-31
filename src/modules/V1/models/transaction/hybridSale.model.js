const mongoose = require("mongoose");

const quickSaleDetailSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, "Item name is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
});

const saleDetailSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product is required"],
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
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
  },
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"],
  },
});

const hybridSaleSchema = new mongoose.Schema(
  {
    saleInvoiceId: {
      type: String,
      required: [true, "Sale invoice ID is required"],
      unique: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store is required"],
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Customer is required"],
    },
    dateOfInvoice: {
      type: Date,
      required: [true, "Date of invoice is required"],
      default: Date.now,
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
    },
    paymentType: {
      type: String,
      enum: ["CASH", "CARD", "ONLINE", "CREDIT"],
      required: [true, "Payment type is required"],
    },
    // Normal sale items
    saleDetails: [saleDetailSchema],
    // Quick sale items
    quickSaleDetails: [quickSaleDetailSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

hybridSaleSchema.pre("save", async function (next) {
  const Product = mongoose.model("Product");
  const Account = mongoose.model("Account");
  const Unit = mongoose.model("Unit");
  const Tax = mongoose.model("Tax");

  // Validate customer
  const isCustomerValid = await Account.exists({ _id: this.customer });
  if (!isCustomerValid) {
    return next(new Error("Invalid Customer ID"));
  }

  // Validate each item in the saleDetails array (for normal sale items)
  const detailValidationPromises = this.saleDetails.map(async (detail) => {
    const [isProductValid, isUnitValid] = await Promise.all([
      Product.exists({ _id: detail.item }),
      Unit.exists({ _id: detail.unit }),
      Tax.exists({ _id: detail.tax }),
    ]);

    if (!isProductValid) throw new Error("Invalid Product ID in saleDetails");
    if (!isUnitValid) throw new Error("Invalid Unit ID in saleDetails");
    if (!isTaxValid) throw new Error("Invalid Tax ID in saleDetails");
  });

  try {
    await Promise.all(detailValidationPromises);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("HybridSale", hybridSaleSchema);
