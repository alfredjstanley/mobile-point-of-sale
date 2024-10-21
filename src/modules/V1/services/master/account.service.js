const { Account } = require("../../models/master");

class AccountService {
  /**
   * Create a new account.
   * @param {Object} accountData - Data for the new account.
   * @returns {Promise<Object>} - The created account.
   */
  async createAccount(accountData) {
    const existingAccount = await Account.findOne({
      mobileNumber: accountData.mobileNumber,
    });
    if (existingAccount) {
      throw new Error("Account with this name or code already exists");
    }

    const account = new Account(accountData);
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
