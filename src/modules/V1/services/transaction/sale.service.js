const {
  Sale,
  TaxTransaction,
  StockTransaction,
  AccountTransaction,
} = require("../../models/transaction");

const { Product, Account } = require("../../models/master");

class SaleService {
  async createSale(data) {
    const session = await Sale.startSession();
    session.startTransaction();

    try {
      const sale = new Sale(data);
      await sale.save({ session });

      // Update stock and create stock transactions
      for (const detail of data.saleDetails) {
        // Decrease product stock
        const product = await Product.findById(detail.item).session(session);
        if (!product) {
          throw new Error(`Product with ID ${detail.item} not found`);
        }
        if (product.stockQuantity < detail.quantity) {
          throw new Error(
            `Insufficient stock for product ${product.name}. Available: ${product.stockQuantity}, Required: ${detail.quantity}`
          );
        }
        product.stockQuantity -= detail.quantity;
        await product.save({ session });

        // Create stock transaction
        const stockTransaction = new StockTransaction({
          transactionType: "SALE",
          transactionMode: "OUT",
          transactionId: sale._id,
          productId: detail.item,
          productName: product.name,
          unitId: detail.unit,
          unit: detail.unit,
          transactionQuantity: detail.quantity,
          accountId: data.customer,
          accountName: "data.customerName", // Fetch customer name later
          transactionDate: data.dateOfInvoice,
          documentNo: data.documentNo,
          createdBy: data.createdBy,
        });
        await stockTransaction.save({ session });
      }

      // Create account transaction
      const accountTransaction = new AccountTransaction({
        documentNo: data.documentNo,
        transactionType: "SALE",
        sAccountId: "671a4b97f46d70fab302c52f",
        dAccountId: "671a4b97f46d70fab302c52f",
        amount: data.totalAmount,
        accountSourceType: "CREDIT",
        narration: `Sale Invoice ${data.saleInvoiceId}`,
        transactionDate: data.dateOfInvoice,
        createdBy: data.createdBy,
      });
      await accountTransaction.save({ session });

      // Create tax transactions
      const taxTransaction = new TaxTransaction({
        transactionType: "SALE",
        transactionMasterId: sale._id,
        transactionDate: data.dateOfInvoice,
        transactionDirection: "OUT",
        taxId: "671a4bb4f46d70fab302c532",
        taxPercentage: 28,
        taxAmount: data.taxAmount,
        accountId: data.customer,
        taxableAmount: data.totalAmount - data.taxAmount,
        createdBy: data.createdBy,
      });
      await taxTransaction.save({ session });

      // Update customer's balance if sale is on credit
      if (data.isCredit) {
        const customer = await Account.findById(data.customer).session(session);
        if (!customer) {
          throw new Error(`Customer with ID ${data.customer} not found`);
        }
        customer.balance += data.totalAmount;
        await customer.save({ session });
      }

      await session.commitTransaction();
      session.endSession();
      return sale;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getSales(filter = {}) {
    return await Sale.find(filter)
      .populate("customer")
      .populate("createdBy")
      .populate("saleDetails.item")
      .populate("saleDetails.unit");
  }

  async getSaleById(id) {
    return await Sale.findById(id)
      .populate("customer")
      .populate("createdBy")
      .populate("saleDetails.item")
      .populate("saleDetails.unit");
  }
}

module.exports = new SaleService();
