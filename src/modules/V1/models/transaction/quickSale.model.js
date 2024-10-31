const mongoose = require("mongoose");

const quickSaleSchema = new mongoose.Schema(
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
      enum: ["CASH", "CARD", "UPI", "CREDIT"],
      required: [true, "Payment type is required"],
    },
    quickSaleDetails: [
      {
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
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

quickSaleSchema.pre("save", async function (next) {
  const Account = mongoose.model("Account");

  // Validate customer
  const isCustomerValid = await Account.exists({ _id: this.customer });
  if (!isCustomerValid) {
    return next(new Error("Invalid Customer ID"));
  }

  next();
});

module.exports = mongoose.model("QuickSale", quickSaleSchema);
