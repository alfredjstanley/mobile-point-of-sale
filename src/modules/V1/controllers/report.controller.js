const reportService = require("../services/report.service");

const reportController = {
  // Sales Report
  async getSalesReport(req, res) {
    try {
      const { period, format } = req.query; // e.g., 'daily', 'weekly', 'monthly'
      const report = await reportService.generateSalesReport(period);
      res.status(200).json({ report });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Product Performance Report
  async getProductPerformanceReport(req, res) {
    try {
      const { period, format } = req.query;
      const report = await reportService.generateProductPerformanceReport(
        period
      );
      res.status(200).json({ report });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Customer Activity Report
  async getCustomerActivityReport(req, res) {
    try {
      const { period, format } = req.query;
      const report = await reportService.generateCustomerActivityReport(period);
      res.status(200).json({ report });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Inventory Report
  async getInventoryReport(req, res) {
    try {
      const report = await reportService.generateInventoryReport();
      res.status(200).json({ report });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Sales Return Report
  async getSalesReturnReport(req, res) {
    try {
      const { period, format } = req.query;
      const report = await reportService.generateSalesReturnReport(period);
      res.status(200).json({ report });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Custom Report
  async getCustomReport(req, res) {
    try {
      const { startDate, endDate, format } = req.query;
      const report = await reportService.generateCustomReport(
        startDate,
        endDate
      );
      res.status(200).json({ report });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Export Report
  async exportReport(req, res) {
    try {
      const { type, period, format } = req.query; // e.g., 'sales', 'products'
      const file = await reportService.exportReport(type, period, format);
      // Set appropriate headers
      res.setHeader("Content-Type", file.contentType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${file.filename}`
      );
      res.send(file.data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = reportController;
