const mongoose = require("mongoose");

const purchaseDetailSchema = new mongoose.Schema({
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

const purchaseSchema = new mongoose.Schema(
  {
    purchaseInvoiceId: {
      type: String,
      required: [true, "Purchase invoice ID is required"],
      unique: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Supplier is required"],
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
    isCredit: {
      type: Boolean,
      default: false,
    },
    paymentType: {
      type: String,
      enum: ["CASH", "CARD", "ONLINE", "CREDIT"],
      required: [true, "Payment type is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
    },
    purchaseDetails: [purchaseDetailSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
