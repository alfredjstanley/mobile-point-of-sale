const { Account } = require("../../models/master");

class AccountService {
  /**
   * Create a new account.
   * @param {Object} data - Data for the new account.
   * @returns {Promise<Object>} - The created account.
   */
  async createAccount(data) {
    const existingAccount = await Account.findOne({
      phoneNumber: data.mobileNumber,
      storeId: data.storeId,
    });
    if (existingAccount) {
      throw new Error("Account with this name or code already exists");
    }

    const account = new Account(data);
    const createdAccount = await account.save();

    return {
      message: "Account created successfully",
      data: createdAccount,
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
