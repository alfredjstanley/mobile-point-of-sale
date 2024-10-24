const {
  Purchase,
  TaxTransaction,
  StockTransaction,
  AccountTransaction,
} = require("../../models/transaction");

const { Product } = require("../../models/master");

class PurchaseService {
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
          productName: "detail.itemName", // You may need to fetch the product name
          unitId: detail.unit,
          unit: detail.unit, // You may need to fetch the unit name
          transactionQuantity: detail.quantity,
          accountId: data.supplier,
          accountName: "data.supplierName", // You may need to fetch the supplier name
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
        dAccountId: data.supplier,
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
        taxId: "671a23930ddd2f5a4e37f73a",
        taxPercentage: 5,
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
}

module.exports = new PurchaseService();
