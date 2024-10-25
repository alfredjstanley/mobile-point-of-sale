const {
  Sale,
  TaxTransaction,
  StockTransaction,
  AccountTransaction,
} = require("../../models/transaction");
const { Tax } = require("../../models/resource");
const { Product, Account } = require("../../models/master");

const TRANSACTION_TYPE = "SALE";
const TRANSACTION_MODE = "OUT";
const TRANSACTION_DIRECTION = "IN";

class SaleService {
  async createSale(data) {
    const session = await Sale.startSession();
    session.startTransaction();

    try {
      const sale = new Sale(data);
      await sale.save({ session });

      // Update product stock and customer balance
      if (data.isCredit) {
        const customer = await Account.findById(data.customer).session(session);
        if (!customer) {
          throw new Error(`Customer with ID ${data.customer} not found`);
        }

        customer.balance += data.totalAmount;
        await customer.save({ session });
      }

      for (const detail of data.saleDetails) {
        const product = await Product.findById(detail.item).session(session);
        if (!product) {
          throw new Error(`Product with ID ${detail.item} not found`);
        }
        // if (product.stockQuantity < detail.quantity) {
        //   throw new Error(
        //     `Insufficient stock for product ${product.name}. Available: ${product.stockQuantity}, Required: ${detail.quantity}`
        //   );
        // }
        product.stockQuantity -= detail.quantity;
        await product.save({ session });

        const tax = await Tax.findById(detail.taxId).session(session);
        if (!tax) {
          throw new Error(`Tax with ID ${detail.taxId} not found`);
        }

        // Create stock transaction
        const stockTransaction = new StockTransaction({
          transactionType: TRANSACTION_TYPE,
          transactionMode: TRANSACTION_MODE,
          transactionId: sale._id,
          productId: detail.item,
          productName: product.name,
          unitId: detail.unit,
          unit: detail.unit,
          transactionQuantity: detail.quantity,
          accountId: customer._id,
          accountName: customer.name,
          transactionDate: data.dateOfInvoice,
          createdBy: data.createdBy,
        });
        await stockTransaction.save({ session });

        // Create tax transactions
        const taxTransaction = new TaxTransaction({
          transactionType: TRANSACTION_TYPE,
          transactionMasterId: sale._id,
          transactionDate: data.dateOfInvoice,
          transactionDirection: TRANSACTION_DIRECTION,
          taxId: tax._id,
          taxPercentage: tax.percentage,
          taxAmount: data.taxAmount,
          accountId: data.customer,
          taxableAmount: data.totalAmount - data.taxAmount,
          createdBy: data.createdBy,
        });
        await taxTransaction.save({ session });
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
