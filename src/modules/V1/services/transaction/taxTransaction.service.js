const { TaxTransaction } = require("../../models/transaction");

class TaxTransactionService {
  // Create a new tax transaction
  async createTaxTransaction(data) {
    const taxTransaction = new TaxTransaction(data);
    return await taxTransaction.save();
  }

  // Get all tax transactions
  async getTaxTransactions(filter = {}) {
    return await TaxTransaction.find(filter)
      .populate("taxId")
      .populate("accountId")
      .populate("createdBy");
  }

  // Get a tax transaction by ID
  async getTaxTransactionById(id) {
    return await TaxTransaction.findById(id)
      .populate("taxId")
      .populate("accountId")
      .populate("createdBy");
  }

  // Update a tax transaction by ID
  async updateTaxTransaction(id, data) {
    return await TaxTransaction.findByIdAndUpdate(id, data, { new: true });
  }

  // Delete a tax transaction by ID
  async deleteTaxTransaction(id) {
    return await TaxTransaction.findByIdAndDelete(id);
  }
}

module.exports = new TaxTransactionService();
