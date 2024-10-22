const {
  Purchase,
  TaxTransaction,
  StockTransaction,
  accountTransactionModel,
} = require("../../models/transaction");

const { Product } = require("../../models/master");

class PurchaseService {
  // Create a new purchase
  async createPurchase(data) {
    const session = await Purchase.startSession();
    session.startTransaction();

    try {
      const purchase = new Purchase(data);
      await purchase.save({ session });

      // Update stock and create stock transactions
      for (const detail of data.purchaseDetails) {
        // Update product stock
        await Product.findByIdAndUpdate(
          detail.item,
          { $inc: { stockQuantity: detail.quantity } },
          { session }
        );

        // Create stock transaction
        const stockTransaction = new StockTransaction({
          transactionType: "PURCHASE",
          transactionMode: "IN",
          transactionId: purchase._id,
          productId: detail.item,
          productName: detail.itemName, // You may need to fetch the product name
          unitId: detail.unit,
          unit: detail.unitName, // You may need to fetch the unit name
          transactionQuantity: detail.quantity,
          accountId: data.supplier,
          accountName: data.supplierName, // You may need to fetch the supplier name
          transactionDate: data.dateOfInvoice,
          documentNo: data.documentNo,
          createdBy: data.createdBy,
        });
        await stockTransaction.save({ session });
      }

      // Create account transaction
      const accountTransaction = new AccountTransaction({
        documentNo: data.documentNo,
        transactionType: "PURCHASE",
        sAccountId: data.supplier,
        dAccountId: "/* Your business account ID */",
        amount: data.totalAmount,
        accountSourceType: "DEBIT",
        narration: `Purchase Invoice ${data.purchaseInvoiceId}`,
        transactionDate: data.dateOfInvoice,
        createdBy: data.createdBy,
      });
      await accountTransaction.save({ session });

      // Create tax transactions
      const taxTransaction = new TaxTransaction({
        transactionType: "PURCHASE",
        transactionMasterId: purchase._id,
        transactionDate: data.dateOfInvoice,
        transactionDirection: "IN",
        taxId: "/* Tax ID */",
        taxPercentage: " /* Tax Percentage */",
        taxAmount: data.taxAmount,
        accountId: data.supplier,
        taxableAmount: data.totalAmount - data.taxAmount,
        createdBy: data.createdBy,
      });
      await taxTransaction.save({ session });

      await session.commitTransaction();
      session.endSession();
      return purchase;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  // Get all purchases
  async getPurchases(filter = {}) {
    return await Purchase.find(filter)
      .populate("supplier")
      .populate("createdBy")
      .populate("purchaseDetails.item")
      .populate("purchaseDetails.unit");
  }

  // Get a purchase by ID
  async getPurchaseById(id) {
    return await Purchase.findById(id)
      .populate("supplier")
      .populate("createdBy")
      .populate("purchaseDetails.item")
      .populate("purchaseDetails.unit");
  }

  // Update a purchase by ID
  async updatePurchase(id, data) {
    // Implement update logic, including adjustments to stock, account, and tax transactions
    // This can be complex and may require additional handling
  }

  // Delete a purchase by ID
  async deletePurchase(id) {
    // Implement deletion logic, including reversing stock, account, and tax transactions
    // Be cautious with deleting financial records
  }
}

module.exports = new PurchaseService();
