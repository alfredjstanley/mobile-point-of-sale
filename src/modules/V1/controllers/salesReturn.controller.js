const salesReturnService = require("../services/salesReturn.service");

const salesReturnController = {
  // Create a new sales return
  async createSalesReturn(req, res) {
    try {
      const returnData = req.body;
      const salesReturn = await salesReturnService.createSalesReturn(
        returnData
      );
      res
        .status(201)
        .json({ message: "Sales return processed successfully", salesReturn });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all sales returns
  async getAllSalesReturns(req, res) {
    try {
      const salesReturns = await salesReturnService.getAllSalesReturns();
      res.status(200).json({ salesReturns });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get a sales return by ID
  async getSalesReturnById(req, res) {
    try {
      const salesReturn = await salesReturnService.getSalesReturnById(
        req.query.id
      );
      if (!salesReturn) {
        return res.status(404).json({ error: "Sales return not found" });
      }
      res.status(200).json({ salesReturn });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = salesReturnController;
