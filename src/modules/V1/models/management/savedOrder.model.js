const mongoose = require("mongoose");

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
  taxAmount: {
    type: Number,
    required: [true, "Tax amount is required"],
  },
  igstAmount: {
    type: Number,
    default: 0,
  },
  cgstAmount: {
    type: Number,
    default: 0,
  },
  sgstAmount: {
    type: Number,
    default: 0,
  },
});

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

const savedOrderSchema = new mongoose.Schema(
  {
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
    orderId: {
      type: String,
      unique: true,
      required: [true, "Save Order ID is required"],
    },
    orderNumber: {
      type: String,
      unique: true,
      required: [true, "Order number is required"],
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
      default: null,
      // Optional: Specify how long the saved order is valid
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      default: 0,
    },
    taxAmount: {
      type: Number,
      required: [true, "Tax amount is required"],
      default: 0,
    },
    igstAmount: {
      type: Number,
      default: 0,
    },
    cgstAmount: {
      type: Number,
      default: 0,
    },
    sgstAmount: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
    },
    saleDetails: {
      type: [saleDetailSchema],
      default: [],
    },
    quickSaleDetails: {
      type: [quickSaleDetailSchema],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save validation middleware
savedOrderSchema.pre("save", async function (next) {
  const Product = mongoose.model("Product");
  const Account = mongoose.model("Account");
  const Unit = mongoose.model("Unit");
  const Tax = mongoose.model("Tax");

  // Validate the main fields in the saved order document
  const isCustomerValid = await Account.exists({
    _id: this.customer,
    storeId: this.storeId,
  });
  if (!isCustomerValid) {
    return next(new Error("Invalid Customer ID"));
  }

  // Validate each item in the saleDetails array
  const detailValidationPromises = this.saleDetails.map(
    async (detail, index) => {
      const storeId = this.storeId;
      const [isProductValid, isUnitValid, isTaxValid] = await Promise.all([
        Product.exists({ _id: detail.item, storeId }),
        Unit.exists({ _id: detail.unit }),
        Tax.exists({ _id: detail.tax }),
      ]);

      if (!isProductValid)
        throw new Error(`Invalid Product ID found at index ${index}`);
      if (!isUnitValid)
        throw new Error(`Invalid Unit ID found at index ${index}`);
      if (!isTaxValid)
        throw new Error(`Invalid Tax ID found at index ${index}`);
    }
  );

  // Wait for all validations to complete
  try {
    await Promise.all(detailValidationPromises);
    next();
  } catch (error) {
    next(error);
  }
});

savedOrderSchema.index({ storeId: 1 });

module.exports = mongoose.model("SavedOrder", savedOrderSchema);
