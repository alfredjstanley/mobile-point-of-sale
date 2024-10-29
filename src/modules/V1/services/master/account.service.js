const { Account } = require("../../models/master");

class AccountService {
  /**
   * Create a new account.
   * @param {Object} data - Data for the new account.
   * @returns {Promise<Object>} - The created account.
   */
  async createAccount(data) {
    const account = new Account(data);
    await account.save();

    return {
      message: "Account created successfully",
    };
  }

  /**
   * Get all accounts.
   * @params [String] storeId - Store ID.
   * @returns {Promise<Array>} - List of all accounts.
   */
  async getAccounts(storeId) {
    return await Account.find({ storeId });
  }
}

module.exports = new AccountService();
