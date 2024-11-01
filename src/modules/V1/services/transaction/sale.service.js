const {
  Sale,
  QuickSale,
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

      // Handle credit if applicable
      if (data.paymentType === "CREDIT") {
        customer.balance += data.totalAmount;
        await customer.save({ session });
      }

      data.saleType =
        data.saleDetails.length > 0 && data.quickSaleDetails.length > 0
          ? "Hybrid"
          : data.saleDetails.length > 0
          ? "Normal"
          : "Quick-Sale";

      if (data.saleDetails.length > 0) {
        const sale = new Sale(data);
        await sale.save({ session });

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

      if (data.quickSaleDetails.length > 0) {
        const quickSaleData = {
          saleInvoiceId: data.saleInvoiceId,
          storeId: data.storeId,
          customer: data.customer,
          dateOfInvoice: data.dateOfInvoice,
          totalAmount: data.totalAmount,
          paymentType: data.paymentType,
          quickSaleDetails: data.quickSaleDetails,
          createdBy: data.createdBy,
        };
        const quickSale = new QuickSale(quickSaleData);
        await quickSale.save({ session });
      }

      const accountTransaction = new AccountTransaction({
        documentNo: data.saleInvoiceId,
        transactionType: TRANSACTION_TYPE,
        sAccountId: customer._id,
        dAccountId: "671a4b97f46d70fab302c52f",
        amount: data.totalAmount,
        accountSourceType: data.paymentType,
        narration: `Sale Invoice ${data.saleInvoiceId}`,
        transactionDate: data.dateOfInvoice,
        createdBy: data.createdBy,
      });
      await accountTransaction.save({ session });

      await session.commitTransaction();
      session.endSession();
      return { message: "Sale created successfully" };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getSales(filter = {}) {
    return await Sale.find(filter)
      .populate("customer")
      .populate("saleDetails.item")
      .populate("saleDetails.unit")
      .populate("saleDetails.tax");
  }

  async getSaleById(id) {
    return await Sale.findById(id)
      .populate("customer")
      .populate("createdBy")
      .populate("saleDetails.item")
      .populate("saleDetails.unit")
      .populate("saleDetails.unit");
  }
}

module.exports = new SaleService();
