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

const saleSchema = new mongoose.Schema(
  {
    saleInvoiceId: {
      type: String,
      unique: true,
      required: [true, "Sale invoice ID is required"],
    },
    billNumber: {
      type: String,
      unique: true,
      required: [true, "Bill number is required"],
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
    saleType: {
      type: String,
      enum: ["Normal", "Quick-Sale", "Hybrid"],
      required: [true, "Sale type is required"],
    },
    dateOfInvoice: {
      type: Date,
      required: [true, "Date of invoice is required"],
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
      // inter-state GST (rarely used)
      type: Number,
      default: 0,
    },
    cgstAmount: {
      // central GST
      type: Number,
      default: 0,
    },
    sgstAmount: {
      // state GST
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    paymentType: {
      type: String,
      enum: ["CASH", "CARD", "UPI", "CREDIT"],
      required: [true, "Payment type is required"],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
    },
    saleDetails: [saleDetailSchema],
    quickSaleDetails: {
      type: [quickSaleDetailSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

saleSchema.pre("save", async function (next) {
  const Product = mongoose.model("Product");
  const Account = mongoose.model("Account");
  const Unit = mongoose.model("Unit");
  const Tax = mongoose.model("Tax");

  // Validate the main fields in the sale document

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

saleSchema.index({ storeId: 1 });

module.exports = mongoose.model("Sale", saleSchema);
