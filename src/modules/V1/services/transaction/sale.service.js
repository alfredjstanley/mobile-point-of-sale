const {
  Sale,
  TaxTransaction,
  StockTransaction,
  AccountTransaction,
} = require("../../models/transaction");
const { Tax } = require("../../models/resource");
const { Product, Account, Unit } = require("../../models/master");

const TRANSACTION_TYPE = "SALE";
const TRANSACTION_MODE = "OUT";
const TRANSACTION_DIRECTION = "IN";

class SaleService {
  async createSale(data) {
    const session = await Sale.startSession();
    session.startTransaction();

    try {
      const customer = await Account.findById(data.customer).session(session);
      if (!customer) throw new Error("Invalid customer ID");

      const sale = new Sale(data);
      await sale.save({ session });

      // Handle credit if applicable
      if (data.paymentType === "CREDIT") {
        customer.balance += data.totalAmount;
        await customer.save({ session });
      }

      if (data.saleDetails.length > 0) {
        for (const detail of data.saleDetails) {
          const product = await Product.findById(detail.item).session(session);
          if (!product) {
            throw new Error(`Product with ID ${detail.item} not found`);
          }

          // Optional: Uncomment if you want stock validation
          // if (product.stockQuantity < detail.quantity) {
          //   throw new Error(
          //     `Insufficient stock for product ${product.name}. Available: ${product.stockQuantity}, Required: ${detail.quantity}`
          //   );
          // }

          product.stockQuantity -= detail.quantity;
          await product.save({ session });

          const tax = await Tax.findById(detail.tax).session(session);
          if (!tax) {
            throw new Error(`Tax with ID ${detail.tax} not found`);
          }

          const unit = await Unit.findById(detail.unit).session(session);
          if (!unit) {
            throw new Error(`Unit with ID ${detail.unit} not found`);
          }

          // Create stock transaction for normal sale items
          const stockTransaction = new StockTransaction({
            transactionType: TRANSACTION_TYPE,
            transactionMode: TRANSACTION_MODE,
            transactionId: sale._id,
            productId: product._id,
            productName: product.name,
            unitId: unit._id,
            unit: unit.name,
            transactionQuantity: detail.quantity,
            accountId: customer._id,
            accountName: customer.name,
            transactionDate: data.dateOfInvoice,
            createdBy: data.createdBy,
          });
          await stockTransaction.save({ session });

          // Create tax transactions for normal sale items
          const taxTransaction = new TaxTransaction({
            transactionType: TRANSACTION_TYPE,
            transactionMasterId: sale._id,
            transactionDate: data.dateOfInvoice,
            transactionDirection: TRANSACTION_DIRECTION,
            taxId: tax._id,
            taxPercentage: tax.rate,
            taxAmount: detail.taxAmount,
            accountId: customer._id,
            taxableAmount: detail.totalAmount - detail.taxAmount,
            createdBy: data.createdBy,
          });
          await taxTransaction.save({ session });
        }
      }

      // Process quick sale details (if present)
      // if (data.quickSaleDetails) {
      //   for (const quickDetail of data.quickSaleDetails) {
      //     // Directly process the item without product reference
      //     const quickStockTransaction = new StockTransaction({
      //       transactionType: "QUICK_SALE",
      //       transactionMode: "OUT",
      //       transactionId: sale._id,
      //       productName: quickDetail.itemName, // No product reference here
      //       transactionQuantity: quickDetail.quantity,
      //       amount: quickDetail.amount,
      //       accountId: customer._id,
      //       accountName: customer.name,
      //       transactionDate: data.dateOfInvoice,
      //       createdBy: data.createdBy,
      //     });
      //     await quickStockTransaction.save({ session });
      //   }
      // }

      // Create an account transaction (common to both sale types)
      // const accountTransaction = new AccountTransaction({
      //   documentNo: data.documentNo,
      //   transactionType: "SALE",
      //   sAccountId: "671a4b97f46d70fab302c52f",
      //   dAccountId: "671a4b97f46d70fab302c52f",
      //   amount: data.totalAmount,
      //   accountSourceType: "CREDIT",
      //   narration: `Sale Invoice ${data.saleInvoiceId}`,
      //   transactionDate: data.dateOfInvoice,
      //   createdBy: data.createdBy,
      // });
      // await accountTransaction.save({ session });

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
