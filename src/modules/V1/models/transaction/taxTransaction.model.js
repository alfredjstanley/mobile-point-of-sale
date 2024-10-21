/**
 * The TaxTransaction model records tax-related transactions associated with purchases, sales, and returns. 
 * It references other models such as Account and Sale or Purchase.
 */
const mongoose = require("mongoose");

const taxTransactionSchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
      enum: ["PURCHASE", "PURCHASE_RETURN", "SALE", "SALE_RETURN"],
      required: [true, "Transaction type is required"],
    },
    transactionMasterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Transaction master ID is required"],
      // References the master transaction (e.g., Sale or Purchase)
    },
    transactionDetailId: {
      type: mongoose.Schema.Types.ObjectId,
      // Optional: References a specific transaction detail if needed
    },
    transactionDocumentNo: {
      type: String,
      trim: true,
    },
    transactionDate: {
      type: Date,
      required: [true, "Transaction date is required"],
    },
    transactionDirection: {
      type: String,
      enum: ["IN", "OUT"],
      required: [true, "Transaction direction is required"],
      //  'IN' for incoming tax (e.g., purchases), 'OUT' for outgoing tax (e.g., sales).
    },
    taxId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tax", // Assuming you have a Tax model
      required: [true, "Tax ID is required"],
    },
    taxPercentage: {
      type: Number,
      required: [true, "Tax percentage is required"],
    },
    taxAmount: {
      type: Number,
      required: [true, "Tax amount is required"],
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Account ID is required"],
    },
    taxableAmount: {
      type: Number,
      required: [true, "Taxable amount is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("TaxTransaction", taxTransactionSchema);
