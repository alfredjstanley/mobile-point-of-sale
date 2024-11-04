const { Sale, QuickSale } = require("../../models/transaction");

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
    const receivedAmount = await calculateReceivedAmount(storeId);

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
async function calculateReceivedAmount(storeId) {
  // TODO: Implement actual logic to calculate received amounts on credits
  return 0;
}

/**
 * Utility function to format numbers as currency.
 */
function formatCurrency(amount) {
  return `₹${amount.toFixed(2)}`;
}

module.exports = {
  generateSaleReport,
};
