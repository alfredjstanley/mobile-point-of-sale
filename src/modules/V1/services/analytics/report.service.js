const {
  Sale,
  QuickSale,
  CreditPayment,
  StockTransaction,
  AccountTransaction,
} = require("../../models/transaction");

/**
 * Placeholder function to calculate sales returns for the store.
 * Implement this function based on your data model for sales returns.
 */
async function calculateSalesReturn(storeId) {
  // TODO: Implement actual logic to calculate sales returns
  return 0;
}

/**
 * Placeholder function to calculate received amount on credits for the store.
 * Implement this function based on your data model for payments received.
 */
async function calculateReceivedAmount(storeId, fromDate, toDate) {
  // Fetch total received amount on credits within the date range
  const receivedPayments = await CreditPayment.aggregate([
    {
      $match: {
        storeId,
        date: {
          $gte: new Date(fromDate + "T00:00:00Z"),
          $lt: new Date(toDate + "T23:59:59Z"),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalReceived: { $sum: "$amount" },
      },
    },
  ]);

  const totalReceived = receivedPayments[0]?.totalReceived || 0;

  return totalReceived;
}

/**
 * Utility function to format numbers as currency.
 */
function formatCurrency(amount) {
  return `₹${amount.toFixed(2)}`;
}

/**
 * Generates a sale report for a given storeId with a date range filter.
 * @param {String} storeId - The store ID for which to generate the report.
 * @param {Object} searchQuery - Filter options including fromDate and toDate.
 * @returns {Promise<Object>} - A promise that resolves to the sale report object.
 */
async function generateSaleReport(storeId, searchQuery = {}) {
  try {
    // Destructure and set default values for searchQuery
    const {
      fromDate = new Date().toISOString().slice(0, 10), // Default to today's date if no fromDate is provided
      toDate = new Date().toISOString().slice(0, 10), // Default to today's date if no toDate is provided
    } = searchQuery;

    // Construct the date range filter
    const dateRangeFilter = {
      dateOfInvoice: {
        $gte: new Date(fromDate + "T00:00:00Z"),
        $lt: new Date(toDate + "T23:59:59Z"),
      },
    };

    // Fetch all sales (normal and quick sales) for the store within the date range
    const [normalSales, quickSales] = await Promise.all([
      Sale.find({ storeId, ...dateRangeFilter })
        .lean()
        .exec(),
      QuickSale.find({ storeId, ...dateRangeFilter })
        .lean()
        .exec(),
    ]);

    // Combine all sales
    const allSales = [...normalSales, ...quickSales];

    // Total Sales (sum of totalAmount from all sales)
    const totalSales = allSales.reduce(
      (sum, sale) => sum + (sale.totalAmount || 0),
      0
    );

    // Sales Return - assuming you have a collection or method to calculate sales returns
    const salesReturn = await calculateSalesReturn(storeId);

    // Net Sale
    const netSale = totalSales - salesReturn;

    // Net Sale Breakdown based on payment type
    const netSaleBreakdown = {
      Cash: 0,
      Online: 0,
      Credit: 0,
    };

    // Map payment types to the required categories
    const paymentTypeMapping = {
      CASH: "Cash",
      CARD: "Online",
      UPI: "Online",
      CREDIT: "Credit",
    };

    for (const sale of allSales) {
      const paymentCategory = paymentTypeMapping[sale.paymentType] || "Other";
      netSaleBreakdown[paymentCategory] += sale.totalAmount || 0;
    }

    // Total Credit and Received Amount on Credits
    const totalCredit = netSaleBreakdown["Credit"];
    const receivedAmount = await calculateReceivedAmount(
      storeId,
      fromDate,
      toDate
    );
    // Prepare the report
    const report = {
      numberOfBills: allSales.length,
      totalSales: formatCurrency(totalSales),
      salesReturn: formatCurrency(salesReturn),
      netSale: formatCurrency(netSale),
      netSaleBreakdown: {
        Cash: formatCurrency(netSaleBreakdown["Cash"]),
        Online: formatCurrency(netSaleBreakdown["Online"]),
        Credit: formatCurrency(netSaleBreakdown["Credit"]),
      },
      credit: {
        totalCredit: formatCurrency(totalCredit),
        received: formatCurrency(receivedAmount),
        balance: formatCurrency(totalCredit - receivedAmount),
      },
    };

    return report;
  } catch (error) {
    console.error("Error generating sale report:", error);
    throw error;
  }
}

/**
 * Retrieves the top-selling products based on net sold quantities for a given store and date range.
 * @param {String} storeId - The store ID for which to generate the report.
 * @param {Object} searchQuery - Filter options including fromDate and toDate.
 * @param {number} limit - The number of top products to retrieve.
 * @returns {Promise<Array>} - An array of top-selling products with their total sold quantities.
 */
async function getTopSellingProducts(storeId, searchQuery = {}, limit = 10) {
  try {
    const {
      fromDate = new Date().toISOString().slice(0, 10),
      toDate = new Date().toISOString().slice(0, 10),
    } = searchQuery;

    // Construct the date range filter
    const dateRangeFilter = {
      transactionDate: {
        $gte: new Date(`${fromDate}T00:00:00Z`),
        $lte: new Date(`${toDate}T23:59:59Z`),
      },
    };

    // Build the match criteria
    const matchCriteria = {
      transactionType: { $in: ["SALE", "SALE_RETURN"] },
      ...dateRangeFilter,
      storeId,
    };

    const results = await StockTransaction.aggregate([
      // Match transactions based on criteria
      {
        $match: matchCriteria,
      },
      // Group by productId and calculate net sold quantity
      {
        $group: {
          _id: "$productId",
          productName: { $first: "$productName" },
          unit: { $first: "$unit" },
          totalSoldQuantity: {
            $sum: {
              $cond: [
                { $eq: ["$transactionType", "SALE"] },
                "$transactionQuantity",
                { $multiply: ["$transactionQuantity", -1] }, // Subtract for SALE_RETURN
              ],
            },
          },
        },
      },
      // Sort by totalSoldQuantity in descending order
      {
        $sort: { totalSoldQuantity: -1 },
      },
      // Limit to the specified number of top products
      {
        $limit: limit,
      },
      // Lookup product details
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      // Project the fields to include in the result
      {
        $project: {
          _id: 0,
          id: "$_id",
          unit: 1,
          productName: 1,
          totalSoldQuantity: 1,
          sellingPrice: "$productDetails.sellingPrice",
        },
      },
    ]);

    return results;
  } catch (error) {
    console.error("Error fetching top-selling products:", error);
    throw error;
  }
}

/**
 * Retrieves the top customers based on net transaction amounts for a given store and date range.
 * @param {String} storeId - The store ID for which to generate the report.
 * @param {Object} searchQuery - Filter options including fromDate and toDate.
 * @param {number} limit - The number of top customers to retrieve.
 * @returns {Promise<Array>} - An array of top customers with their total transaction amounts.
 */
async function getTopCustomers(storeId, searchQuery = {}, limit = 10) {
  try {
    const {
      fromDate = new Date().toISOString().slice(0, 10),
      toDate = new Date().toISOString().slice(0, 10),
    } = searchQuery;

    // Construct the date range filter
    const dateRangeFilter = {
      transactionDate: {
        $gte: new Date(`${fromDate}T00:00:00Z`),
        $lte: new Date(`${toDate}T23:59:59Z`),
      },
    };

    // Build the match criteria
    const matchCriteria = {
      transactionType: { $in: ["SALE", "SALE_RETURN"] },
      ...dateRangeFilter,
      storeId,
    };

    const results = await AccountTransaction.aggregate([
      // Match transactions based on criteria
      {
        $match: matchCriteria,
      },
      // Group by customer account (dAccountId) and calculate net amount and bills count
      {
        $group: {
          _id: "$dAccountId",
          totalAmount: {
            $sum: {
              $cond: [
                { $eq: ["$transactionType", "SALE"] },
                "$amount",
                { $multiply: ["$amount", -1] }, // Subtract for SALE_RETURN
              ],
            },
          },
          billsCount: { $sum: 1 }, // Count number of transactions per customer
        },
      },
      { $sort: { totalAmount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "accounts",
          localField: "_id",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      { $unwind: "$customerDetails" },
      {
        $project: {
          _id: 0,
          customerId: "$_id",
          customerName: "$customerDetails.name",
          phoneNumber: "$customerDetails.phone",
          totalAmount: 1,
          billsCount: 1,
        },
      },
    ]);

    return results;
  } catch (error) {
    console.error("Error fetching top customers:", error);
    throw error;
  }
}

module.exports = {
  getTopCustomers,
  generateSaleReport,
  getTopSellingProducts,
};
