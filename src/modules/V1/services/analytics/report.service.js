const { Sale, QuickSale } = require("../../models/transaction");

/**
 * Generates a sale report for a given storeId.
 * @param {String} storeId - The store ID for which to generate the report.
 * @returns {Promise<Object>} - A promise that resolves to the sale report object.
 */
async function generateSaleReport(storeId) {
  try {
    // Fetch all sales (normal and quick sales) for the store
    const [normalSales, quickSales] = await Promise.all([
      Sale.find({ storeId }).lean().exec(),
      QuickSale.find({ storeId }).lean().exec(),
    ]);

    // Combine all sales
    const allSales = [...normalSales, ...quickSales];

    // Number of Bills
    const numberOfBills = allSales.length;

    // Total Sales (sum of totalAmount from all sales)
    const totalSales = allSales.reduce(
      (sum, sale) => sum + (sale.totalAmount || 0),
      0
    );

    // Sales Return - assuming you have a collection or method to calculate sales returns
    const salesReturn = await calculateSalesReturn(storeId);

    // Net Sale
    const netSale = totalSales - salesReturn;

    // Net Sale Breakdown
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
      const paymentType = sale.paymentType;
      const category = paymentTypeMapping[paymentType] || "Other";
      netSaleBreakdown[category] += sale.totalAmount || 0;
    }

    // Total Credit
    const totalCredit = netSaleBreakdown["Credit"];

    // Received Amount on Credits - assuming you have a method to calculate this
    const receivedAmount = await calculateReceivedAmount(storeId);

    // Prepare the report
    const report = {
      numberOfBills: numberOfBills,
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
  // For now, return 0 or fetch from SalesReturn collection if available
  return 0;
}

/**
 * Placeholder function to calculate received amount on credits for the store.
 * Implement this function based on your data model for payments received.
 */
async function calculateReceivedAmount(storeId) {
  // TODO: Implement actual logic to calculate received amounts on credits
  // For now, return 0 or fetch from Payments collection if available
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
