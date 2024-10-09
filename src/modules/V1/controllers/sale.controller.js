const saleService = require("../services/sales.service");

const saleController = {
  // Create a new sale
  async createSale(req, res) {
    try {
      // Include the user ID from the authenticated user
      const saleData = req.body;
      const sale = await saleService.createSale(saleData);
      res
        .status(201)
        .json({
          success: true,
          data: { message: "Sale created successfully", sale },
        });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all sales
  async getAllSales(req, res) {
    try {
      const sales = await saleService.getAllSales();
      res.status(200).json({ sales });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get a sale by ID
  async getSaleById(req, res) {
    try {
      const sale = await saleService.getSaleById(req.params.id);
      if (!sale) {
        return res.status(404).json({ error: "Sale not found" });
      }
      res.status(200).json({ sale });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = saleController;
