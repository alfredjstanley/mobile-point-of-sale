const { Sale, QuickSale } = require("../../models/transaction");

/**
 * Generates a bill report for a given storeId with a date range filter.
 * @param {String} storeId - The store ID for which to generate the report.
 * @param {Object} searchQuery - Filter options including fromDate and toDate.
 * @returns {Promise<Object>} - A promise that resolves to the bill report object.
 */
async function generateBillReport(storeId, searchQuery = {}) {
  try {
    // Set default dates to today's date if not provided
    const {
      fromDate = new Date().toISOString().slice(0, 10),
      toDate = new Date().toISOString().slice(0, 10),
    } = searchQuery;

    // Construct date range filter
    const dateRangeFilter = {
      dateOfInvoice: {
        $gte: new Date(fromDate + "T00:00:00Z"),
        $lt: new Date(toDate + "T23:59:59Z"),
      },
    };

    // Fetch sales and quick sales with customer details
    const [normalSales, quickSales] = await Promise.all([
      Sale.find({ storeId, ...dateRangeFilter })
        .populate("customer", "name phone")
        .lean()
        .exec(),
      QuickSale.find({ storeId, ...dateRangeFilter })
        .populate("customer", "name phone")
        .lean()
        .exec(),
    ]);

    // Combine all sales
    const allSales = [...normalSales, ...quickSales];

    // Initialize accumulators
    let cashSaleTotal = 0;
    let creditSaleTotal = 0;
    let onlineSaleTotal = 0;
    let cashBills = [];
    let creditBills = [];
    let onlineBills = [];

    // Map payment types to categories
    const paymentTypeMapping = {
      CASH: "Cash",
      CARD: "Online",
      UPI: "Online",
      CREDIT: "Credit",
    };

    // Process each sale
    for (const sale of allSales) {
      // Determine payment category
      const paymentCategory = paymentTypeMapping[sale.paymentType] || "Other";

      // Prepare bill object
      const bill = {
        id: sale._id,
        bill_no: sale.billNumber,
        date: formatDate(sale.dateOfInvoice),
        customer_name: sale.customer.name,
        contact: sale.customer.phone,
        items:
          (sale.saleDetails ? sale.saleDetails.length : 0) +
          (sale.quickSaleDetails ? sale.quickSaleDetails.length : 0),

        amount: sale.totalAmount,
      };

      if (paymentCategory === "Cash") {
        cashSaleTotal += sale.totalAmount || 0;
        cashBills.push(bill);
      } else if (paymentCategory === "Credit") {
        creditSaleTotal += sale.totalAmount || 0;
        creditBills.push(bill);
      } else if (paymentCategory === "Online") {
        onlineSaleTotal += sale.totalAmount || 0;
        onlineBills.push(bill);
      }
    }

    // Prepare sales summary
    const sales_summary = {
      cash_sale: formatCurrency(cashSaleTotal),
      online_sale: formatCurrency(onlineSaleTotal),
      credit_sale: formatCurrency(creditSaleTotal),
    };

    // Prepare tabs
    const tabs = [
      `Cash (${cashBills.length})`,
      `Online (${onlineBills.length})`,
      `Credit (${creditBills.length})`,
    ];

    // Prepare bills
    const bills = {
      cash: cashBills,
      online: onlineBills,
      credit: creditBills,
    };

    // Prepare the final report
    const report = {
      sales_summary,
      tabs,
      bills,
    };

    return report;
  } catch (error) {
    console.error("Error generating bill report:", error);
    throw error;
  }
}

// Helper function to format currency
function formatCurrency(amount) {
  return "₹" + amount.toFixed(2);
}

// Helper function to format date as '10-Oct-2024, 04:30 AM'
function formatDate(date) {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format

  const time = `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;

  return `${day}-${month}-${year}, ${time}`;
}

module.exports = {
  generateBillReport,
};
