const Sale = require("../models/sales.model");
const { Product } = require("../models/master");

const saleService = {
  // Create a new sale
  async createSale(saleData) {
    // Validate products and adjust stock quantities
    for (const item of saleData.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product with ID ${item.product} not found`);
      }
      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }
      // Deduct the sold quantity from the product's stock
      product.quantity -= item.quantity;
      await product.save();
    }

    // Calculate total amount if not provided
    if (!saleData.totalAmount) {
      saleData.totalAmount = saleData.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    }

    const newSale = new Sale(saleData);
    return await newSale.save();
  },

  // Get all sales
  async getAllSales() {
    return await Sale.find()
      .populate("customer")
      .populate("items.product")
      .populate("createdBy", "firstName lastName");
  },

  // Get a sale by ID
  async getSaleById(saleId) {
    return await Sale.findById(saleId)
      .populate("customer")
      .populate("items.product")
      .populate("createdBy", "firstName lastName");
  },
};

module.exports = saleService;
