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

        // saletype logic
        const saleType =
          data.saleDetails.length > 0 && data.quickSaleDetails.length > 0
            ? "Hybrid"
            : data.saleDetails.length > 0
            ? "Normal"
            : data.quickSaleDetails.length > 0 && "Quick-Sale";

        // if sale type not contains normal or quick-sale or hybrid, throw error message
        if (!["Normal", "Quick-Sale", "Hybrid"].includes(saleType)) {
          throw new Error("Invalid sale type");
        } else data.saleType = saleType;

        // **Start transaction logic**

        const customer = await Account.findById(data.customer).session(session);
        if (!customer) throw new Error("Invalid customer ID");

        // Prevent creating credit sale for [Local Sales]
        if (
          data.paymentType === "CREDIT" &&
          customer.name === "[Local Sales]"
        ) {
          throw new Error("Cannot create credit sale for [Local Sales]");
        }

        // Handle credit if applicable
        if (data.paymentType === "CREDIT") {
          customer.balance += data.totalAmount;
          await customer.save({ session });
        }

        if (saleType === "Normal" || saleType === "Hybrid") {
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
              storeId: data.storeId,
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
              storeId: data.storeId,
            });
            await taxTransaction.save({ session });
          }
        }

        if (saleType === "Quick-Sale") {
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
          dAccountId: customer._id,
          sAccountId: "671a4b97f46d70fab302c52f", // dummy account ID TODO: replace with actual fns
          amount: data.totalAmount,
          accountSourceType: data.paymentType === "CREDIT" ? "CREDIT" : "DEBIT",
          narration: `Sale Invoice ${data.saleInvoiceId}`,
          transactionDate: data.dateOfInvoice,
          createdBy: data.createdBy,
          storeId: data.storeId,
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
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getAllSales(filter = {}) {
    try {
      const [sales, quickSales] = await Promise.all([
        Sale.find(filter).lean(),
        QuickSale.find(filter).lean(),
      ]);

      return { sales, quickSales };
    } catch (error) {
      throw error;
    }
  }

  async getSaleById(id) {
    try {
      const [sale, quickSale] = await Promise.all([
        Sale.findById(id)
          .populate("customer", "name -_id")
          .populate({ path: "saleDetails.item", select: "name" })
          .lean(),
        QuickSale.findById(id).populate("customer", "name").lean(),
      ]);

      if (sale) {
        sale.customer = sale.customer.name; // Transform customer field to contain only the name (UI requirement)
        // loop through sale details and change item into item.name
        sale.saleDetails = sale.saleDetails.map((detail) => {
          detail.item = detail.item.name;
          delete detail._id;
          return detail;
        });
        delete sale.storeId;
        delete sale.createdAt;
        delete sale.updatedAt;
        return { type: "Sale", data: sale };
      }
      if (quickSale) {
        quickSale.customer = quickSale.customer.name;
        // loop through 'quickSaleDetails' and delete _id field
        quickSale.quickSaleDetails = quickSale.quickSaleDetails.map(
          (detail) => {
            delete detail._id;
            return detail;
          }
        );

        delete quickSale.storeId;
        delete quickSale.createdAt;
        delete quickSale.updatedAt;
        return { type: "QuickSale", data: quickSale };
      }

      throw new Error("Sale not found");
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new SaleService();
