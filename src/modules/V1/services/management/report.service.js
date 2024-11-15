const { Sale, QuickSale, CreditPayment } = require("../../models/transaction");
const { Account } = require("../../models/master");

// Helper functions
// Format currency as '₹123.45'
function formatCurrency(amount) {
  return "₹" + amount.toFixed(2);
}

// Format date as '10-Oct-2024, 04:30 AM'
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

/**
 * Generates a credit sale report for a given storeId with an optional date range.
 * @param {String} storeId - The store ID for which to generate the report.
 * @param {Object} searchQuery - Filter options including fromDate and toDate.
 * @returns {Promise<Object>} - A promise that resolves to the credit sale report object.
 */
async function generateCreditSaleReport(storeId, searchQuery = {}) {
  try {
    // Set default dates if not provided
    const {
      fromDate = new Date(new Date().setMonth(new Date().getMonth() - 1))
        .toISOString()
        .slice(0, 10), // Default to 1 month ago
      toDate = new Date().toISOString().slice(0, 10), // Default to today's date
    } = searchQuery;

    // Construct date range filter
    const dateRangeFilter = {
      dateOfInvoice: {
        $gte: new Date(fromDate + "T00:00:00Z"),
        $lt: new Date(toDate + "T23:59:59Z"),
      },
    };

    // Fetch all credit sales (normal and quick sales)
    const [creditSales, creditQuickSales] = await Promise.all([
      Sale.find({
        storeId,
        paymentType: "CREDIT",
        ...dateRangeFilter,
      })
        .populate("customer", "name phone") // Use 'phone' or 'mobileNumber' consistently
        .lean()
        .exec(),
      QuickSale.find({
        storeId,
        paymentType: "CREDIT",
        ...dateRangeFilter,
      })
        .populate("customer", "name phone") // Use 'phone' or 'mobileNumber' consistently
        .lean()
        .exec(),
    ]);

    // Combine all credit sales
    const allCreditSales = [...creditSales, ...creditQuickSales];

    // Total credit amount (sum of totalAmount from all credit sales)
    const totalCredit = allCreditSales.reduce(
      (sum, sale) => sum + (sale.totalAmount || 0),
      0
    );

    // Number of bills
    const billsCount = allCreditSales.length;

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

    // Pending amount
    const pendingAmount = totalCredit - totalReceived;

    // Prepare bills array
    const bills = allCreditSales.map((sale) => ({
      id: sale._id,
      bill_no: sale.billNumber,
      date: formatDate(sale.dateOfInvoice),
      customer_name: sale.customer?.name || "Unknown",
      contact: sale.customer?.phone || "No number",
      items:
        (sale.saleDetails ? sale.saleDetails.length : 0) +
        (sale.quickSaleDetails ? sale.quickSaleDetails.length : 0),
      amount: sale.totalAmount,
    }));

    // Prepare the report
    const report = {
      time_periods: ["1 Month", "6 Months", "1 Year"],
      total_sale_credit: {
        total: formatCurrency(totalCredit),
        received: formatCurrency(totalReceived),
        pending: formatCurrency(pendingAmount),
      },
      summary: {
        bills_count: billsCount,
        total_credit: formatCurrency(totalCredit),
      },
      bills,
    };

    return report;
  } catch (error) {
    console.error("Error generating credit sale report:", error);
    throw error;
  }
}

/**
 * Generates a bill report for a specific customer within an optional date range.
 * @param {String} storeId - The store ID.
 * @param {String} customerId - The customer ID.
 * @param {Object} searchQuery - Filter options including fromDate and toDate.
 * @returns {Promise<Object>} - A promise that resolves to the customer bill report object.
 */
async function generateCustomerBillReport(
  storeId,
  searchQuery = {},
  customerId
) {
  try {
    // Set default dates if not provided
    const {
      fromDate = new Date(new Date().setMonth(new Date().getMonth() - 1))
        .toISOString()
        .slice(0, 10), // Default to 1 month ago
      toDate = new Date().toISOString().slice(0, 10), // Default to today's date
    } = searchQuery;

    // Construct date range filter
    const dateRangeFilter = {
      dateOfInvoice: {
        $gte: new Date(fromDate + "T00:00:00Z"),
        $lte: new Date(toDate + "T23:59:59Z"),
      },
    };

    // Fetch customer data
    const customer = await Account.findById(customerId).lean();
    if (!customer) {
      throw new Error("Customer not found");
    }

    // Fetch all sales (normal and quick sales) for the customer within the date range
    const [customerSales, customerQuickSales] = await Promise.all([
      Sale.find({
        storeId,
        customer: customerId,
        ...dateRangeFilter,
      })
        .lean()
        .exec(),
      QuickSale.find({
        storeId,
        customer: customerId,
        ...dateRangeFilter,
      })
        .lean()
        .exec(),
    ]);

    // Combine all sales
    const allSales = [...customerSales, ...customerQuickSales];

    // Initialize bills arrays
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
        bill_no: sale.billNumber,
        date: formatDate(sale.dateOfInvoice),
        sales_type: sale.saleType || "Local Sales",
        reference: sale.reference || "0000000000",
        items:
          (sale.saleDetails ? sale.saleDetails.length : 0) +
          (sale.quickSaleDetails ? sale.quickSaleDetails.length : 0),
        amount: sale.totalAmount,
      };

      if (paymentCategory === "Cash") {
        cashBills.push(bill);
      } else if (paymentCategory === "Credit") {
        creditBills.push(bill);
      } else if (paymentCategory === "Online") {
        onlineBills.push(bill);
      }
    }

    // Prepare tabs
    const tabs = ["Cash", "Online", "Credit"];

    // Prepare the report
    const report = {
      customer: {
        name: customer.name,
        contact: customer.phone || customer.mobileNumber || "No number",
      },
      tabs,
      bills: [...cashBills, ...onlineBills, ...creditBills],
    };

    return report;
  } catch (error) {
    console.error("Error generating customer bill report:", error);
    throw error;
  }
}

module.exports = {
  generateBillReport,
  generateCreditSaleReport,
  generateCustomerBillReport,
};
