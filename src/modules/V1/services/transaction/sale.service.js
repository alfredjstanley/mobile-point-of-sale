const { Sale } = require("../../models/transaction");

class SaleService {
  async createSale(data) {
    const sale = new Sale(data);
    return await sale.save();
  }

  async getSales(filter = {}) {
    return await Sale.find(filter)
      .populate("customer")
      .populate("createdBy")
      .populate("saleDetails.item")
      .populate("saleDetails.unit");
  }

  async getSaleById(id) {
    return await Sale.findById(id)
      .populate("customer")
      .populate("createdBy")
      .populate("saleDetails.item")
      .populate("saleDetails.unit");
  }
}

module.exports = new SaleService();
