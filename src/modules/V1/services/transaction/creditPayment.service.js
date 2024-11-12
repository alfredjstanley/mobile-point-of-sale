const { CreditPayment } = require("../../models/transaction");
const { Account } = require("../../models/master");

class CreditPaymentService {
  /**
   * Records a credit payment made by a customer.
   * @param {String} storeId - The store ID.
   * @param {String} customerId - The customer ID.
   * @param {Number} amount - The payment amount.
   * @param {String} paymentMethod - The method of payment.
   * @param {String} reference - (Optional) Reference or notes.
   * @returns {Promise<Object>} - The recorded payment.
   */
  async recordCreditPayment({
    storeId,
    customerId,
    amount,
    paymentMethod,
    createdBy,
    reference = "",
  }) {
    try {
      // Validate input
      if (amount <= 0) {
        throw new Error("Payment amount must be greater than zero.");
      }

      // Create a new credit payment record
      const payment = new CreditPayment({
        storeId,
        customer: customerId,
        amount,
        paymentMethod,
        reference,
        createdBy,
      });

      await payment.save();

      // Update customer's outstanding balance
      const customer = await Account.findById(customerId);
      if (customer) {
        await customer.updateBalance();
      }

      return payment;
    } catch (error) {
      console.error("Error recording credit payment:", error);
      throw error;
    }
  }
}

module.exports = new CreditPaymentService();
