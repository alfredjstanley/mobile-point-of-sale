/**
 * The StockTransaction model records changes to product stock levels due to various transactions.
 */

const mongoose = require("mongoose");

const stockTransactionSchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
      enum: [
        "PURCHASE",
        "PURCHASE_RETURN",
        "SALE",
        "SALE_RETURN",
        "OPENING_STOCK",
      ],
      required: [true, "Transaction type is required"],
    },
    documentNo: {
      type: String,
      trim: true,
    },
    transactionMode: {
      type: String,
      enum: ["IN", "OUT"],
      required: [true, "Transaction mode is required"],
      // 'IN' for stock additions, 'OUT' for stock deductions.
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Transaction ID is required"],
      // References the related transaction (e.g., Sale or Purchase)
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    productName: {
      type: String,
      required: [true, "Product name is required"],
    },
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: [true, "Unit ID is required"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
    },
    transactionQuantity: {
      type: Number,
      required: [true, "Transaction quantity is required"],
      // Quantity of the product involved.
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Account ID is required"],
    },
    accountName: {
      type: String,
      required: [true, "Account name is required"],
    },
    transactionDate: {
      type: Date,
      required: [true, "Transaction date is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("StockTransaction", stockTransactionSchema);
