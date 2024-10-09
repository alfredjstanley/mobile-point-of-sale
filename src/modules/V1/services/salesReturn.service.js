const Sale = require("../models/sales.model");
const Product = require("../models/product.model");
const SalesReturn = require("../models/salesReturn.model");

const salesReturnService = {
  // Create a new sales return
  async createSalesReturn(returnData) {
    // Validate sale
    const sale = await Sale.findById(returnData.sale);
    if (!sale) {
      throw new Error("Sale not found");
    }

    // Validate items and adjust stock quantities
    for (const item of returnData.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product with ID ${item.product} not found`);
      }
      // Increase the product's stock by the returned quantity
      product.quantity += item.quantity;
      await product.save();
    }

    // Calculate total refund if not provided
    if (!returnData.totalRefund) {
      returnData.totalRefund = returnData.items.reduce(
        (total, item) => total + item.quantity * item.price, // Assume item.price is included in items
        0
      );
    }

    const newSalesReturn = new SalesReturn(returnData);
    return await newSalesReturn.save();
  },

  // Get all sales returns
  async getAllSalesReturns() {
    return await SalesReturn.find()
      .populate("sale")
      .populate("items.product")
      .populate("processedBy", "firstName lastName");
  },

  // Get a sales return by ID
  async getSalesReturnById(returnId) {
    return await SalesReturn.findById(returnId)
      .populate("sale")
      .populate("items.product")
      .populate("processedBy", "firstName lastName");
  },
};

module.exports = salesReturnService;
