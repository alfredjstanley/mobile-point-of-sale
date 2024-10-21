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

const saleSchema = new mongoose.Schema(
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
    discountAmount: {
      type: Number,
      default: 0,
    },
    saleType: {
      type: String,
      enum: ["RETAIL", "WHOLESALE"],
      required: [true, "Sale type is required"],
    },
    isCredit: {
      type: Boolean,
      default: false,
    },
    paymentType: {
      type: String,
      enum: ["CASH", "CARD", "ONLINE", "CREDIT"],
      required: [true, "Payment type is required"],
    },
    documentNo: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
    },
    saleDetails: [saleDetailSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Sale", saleSchema);
