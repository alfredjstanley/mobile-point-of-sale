/**
 * The AccountTransaction model records financial transactions affecting account balances.
 */
const mongoose = require("mongoose");

const accountTransactionSchema = new mongoose.Schema(
  {
    documentNo: {
      type: String,
      required: [true, "Document number is required"],
      trim: true,
      unique: true,
    },
    transactionType: {
      type: String,
      enum: ["PURCHASE", "PURCHASE_RETURN", "SALE", "SALE_RETURN"],
      required: [true, "Transaction type is required"],
    },
    sAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Source account ID is required"],
    },
    dAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Destination account ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    accountSourceType: {
      type: String,
      enum: ["DEBIT", "CREDIT"],
      required: [true, "Account source type is required"],
    },
    narration: {
      type: String,
      trim: true,
    },
    transactionDate: {
      type: Date,
      required: [true, "Transaction date is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store is required"],
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

module.exports = mongoose.model("AccountTransaction", accountTransactionSchema);
