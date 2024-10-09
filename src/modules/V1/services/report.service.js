const Sale = require("../models/sales.model");
const Product = require("../models/product.model");
// const Customer = require("../models/customer.model");
const SalesReturn = require("../models/salesReturn.model");
const {
  exportToExcel,
  exportToPDF,
  exportToCSV,
} = require("../../../utils/export.util");

const reportService = {
  // Generate Sales Report
  async generateSalesReport(period) {
    const matchStage = this._getMatchStage(period, "saleDate");
    const sales = await Sale.aggregate([
      matchStage,
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);
    return sales[0] || { totalSales: 0, totalTransactions: 0 };
  },

  // Generate Product Performance Report
  async generateProductPerformanceReport(period) {
    const matchStage = this._getMatchStage(period, "saleDate");
    const report = await Sale.aggregate([
      matchStage,
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalQuantitySold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          productName: "$product.name",
          totalQuantitySold: 1,
          totalRevenue: 1,
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);
    return report;
  },

  // Generate Customer Activity Report
  async generateCustomerActivityReport(period) {
    const matchStage = this._getMatchStage(period, "saleDate");
    const report = await Sale.aggregate([
      matchStage,
      {
        $group: {
          _id: "$customer",
          totalSpent: { $sum: "$totalAmount" },
          totalTransactions: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      {
        $project: {
          customerName: {
            $concat: ["$customer.firstName", " ", "$customer.lastName"],
          },
          totalSpent: 1,
          totalTransactions: 1,
        },
      },
      { $sort: { totalSpent: -1 } },
    ]);
    return report;
  },

  // Generate Inventory Report
  async generateInventoryReport() {
    const products = await Product.find({}, "name quantity price status");
    return products;
  },

  // Generate Sales Return Report
  async generateSalesReturnReport(period) {
    const matchStage = this._getMatchStage(period, "returnDate");
    const report = await SalesReturn.aggregate([
      matchStage,
      {
        $group: {
          _id: null,
          totalReturns: { $sum: 1 },
          totalRefunded: { $sum: "$totalRefund" },
        },
      },
    ]);
    return report[0] || { totalReturns: 0, totalRefunded: 0 };
  },

  // Generate Custom Report
  async generateCustomReport(startDate, endDate) {
    const matchStage = {
      $match: {
        saleDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    };
    // Implement custom aggregation as needed
    const sales = await Sale.aggregate([
      matchStage,
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);
    return sales[0] || { totalSales: 0, totalTransactions: 0 };
  },

  // Export Report
  async exportReport(type, period, format) {
    let data;
    switch (type) {
      case "sales":
        data = await this.generateSalesReport(period);
        break;
      case "products":
        data = await this.generateProductPerformanceReport(period);
        break;
      case "customers":
        data = await this.generateCustomerActivityReport(period);
        break;
      case "inventory":
        data = await this.generateInventoryReport();
        break;
      case "sales-returns":
        data = await this.generateSalesReturnReport(period);
        break;
      default:
        throw new Error("Invalid report type");
    }

    // Export data to the specified format
    switch (format) {
      case "excel":
        return exportToExcel(data, `${type}-report.xlsx`);
      case "pdf":
        return exportToPDF(data, `${type}-report.pdf`);
      case "csv":
        return exportToCSV(data, `${type}-report.csv`);
      default:
        throw new Error("Invalid format");
    }
  },

  // Helper function to generate match stage for aggregation
  _getMatchStage(period, dateField) {
    let matchStage = {};
    const today = new Date();
    switch (period) {
      case "daily":
        matchStage = {
          $match: {
            [dateField]: {
              $gte: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              ),
            },
          },
        };
        break;
      case "weekly":
        const weekStart = new Date();
        weekStart.setDate(today.getDate() - today.getDay());
        matchStage = {
          $match: {
            [dateField]: {
              $gte: weekStart,
            },
          },
        };
        break;
      case "monthly":
        matchStage = {
          $match: {
            [dateField]: {
              $gte: new Date(today.getFullYear(), today.getMonth(), 1),
            },
          },
        };
        break;
      case "yearly":
        matchStage = {
          $match: {
            [dateField]: {
              $gte: new Date(today.getFullYear(), 0, 1),
            },
          },
        };
        break;
      default:
        matchStage = { $match: {} };
        break;
    }
    return matchStage;
  },
};

module.exports = reportService;
