const mongoose = require("mongoose");

const {
  Sale,
  QuickSale,
  TaxTransaction,
  StockTransaction,
  AccountTransaction,
} = require("../../models/transaction");

const { Tax } = require("../../models/resource");
const { Product, Account, Unit } = require("../../models/master");

const { getNextSequence } = require("../../../../utils/counter.utils");

const TRANSACTION_TYPE = "SALE";
const TRANSACTION_MODE = "OUT";
const TRANSACTION_DIRECTION = "IN";
const SALES_INVOICE_PREFIX = "SINV";

class SaleService {
  async createSale(data) {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        // **Generate a unique bill number**
        const billNumberType = `${SALES_INVOICE_PREFIX}-${data.storeId}`;
        let billNumber = await getNextSequence(billNumberType, session);

        // Format bill number to 4 digits and storenumber to 2 digits
        billNumber = billNumber.toString().padStart(4, "0");
        data.storeNumber = data.storeNumber.toString().padStart(2, "0");

        // Get last two digits of the year
        const year = new Date().getFullYear().toString().slice(-2);
        data.billNumber = `${SALES_INVOICE_PREFIX}-${year}-${data.storeNumber}-${billNumber}`; // e.g. SINV-21-01-0001

        // **Start transaction logic**

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
            const product = await Product.findById(detail.item).session(
              session
            );
            if (!product) {
              throw new Error(`Product with ID ${detail.item} not found`);
            }

            // Update stock quantity
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
            billNumber: data.billNumber,
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
          accountSourceType: data.paymentType === "CREDIT" ? "CREDIT" : "DEBIT",
          narration: `Sale Invoice ${data.saleInvoiceId}`,
          transactionDate: data.dateOfInvoice,
          createdBy: data.createdBy,
        });
        await accountTransaction.save({ session });

        // **End of transaction logic**
      });
      session.endSession();
      return {
        message: "Sale created successfully",
        billNumber: data.billNumber,
      };
    } catch (error) {
      session.endSession();
      throw error;
    }
  }
  async getAllSales(filter = {}) {
    try {
      const sales = await Sale.aggregate([
        { $match: filter },
        { $addFields: { source: "Sale" } }, // Add a field to differentiate Sale and QuickSale entries
        {
          $unionWith: {
            coll: "quicksales",
            pipeline: [
              { $match: filter },
              { $addFields: { source: "QuickSale" } },
            ],
          },
        },
        // Group by saleInvoiceId to merge entries with the same saleInvoiceId
        {
          $group: {
            _id: "$saleInvoiceId",
            sales: { $push: "$$ROOT" },
          },
        },
        // Optionally, unwind the sales array if you prefer flat results
      ]).exec();

      // Now, for each grouped sale, process the merging of Sale and QuickSale entries
      const mergedSales = sales.map((group) => {
        const { _id: saleInvoiceId, sales } = group;

        // Separate entries from Sale and QuickSale
        const saleEntry = sales.find((s) => s.source === "Sale");
        const quickSaleEntry = sales.find((s) => s.source === "QuickSale");

        // Merge the entries as needed
        const mergedEntry = {
          saleInvoiceId,
          storeId: saleEntry ? saleEntry.storeId : quickSaleEntry.storeId,
          customer: saleEntry ? saleEntry.customer : quickSaleEntry.customer,
          dateOfInvoice: saleEntry
            ? saleEntry.dateOfInvoice
            : quickSaleEntry.dateOfInvoice,
          totalAmount:
            (saleEntry ? saleEntry.totalAmount : 0) +
            (quickSaleEntry ? quickSaleEntry.totalAmount : 0),
          paymentType: saleEntry
            ? saleEntry.paymentType
            : quickSaleEntry.paymentType,
          saleType: saleEntry ? saleEntry.saleType : "Quick-Sale",
          // Merge other fields as necessary
          saleDetails: saleEntry ? saleEntry.saleDetails : [],
          quickSaleDetails: quickSaleEntry
            ? quickSaleEntry.quickSaleDetails
            : [],
          // Include other fields from both entries as needed
        };

        return mergedEntry;
      });

      return mergedSales;

      // Populate references if needed (since aggregation doesn't populate automatically)
      // For populating after aggregation, you can use Mongoose's `Model.populate()` method
      // const options = [
      //   { path: "storeId", model: "Store" },
      //   { path: "customer", model: "Account" },
      //   { path: "saleDetails.item", model: "Product" },
      //   { path: "saleDetails.unit", model: "Unit" },
      //   { path: "saleDetails.tax", model: "Tax" },
      // ];

      // Since we have an array of plain objects, we need to convert them to Mongoose documents to use `populate()`
      // const SaleModel = mongoose.model("Sale");
      // const populatedSales = await SaleModel.populate(mergedSales, options);

      // return populatedSales;
    } catch (error) {
      console.error("Error fetching sales by store ID:", error);
      throw error;
    }
  }

  async getSalesOld(filter = {}) {
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
