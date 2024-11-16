const { Account } = require("../../models/master");
const wacApiService = require("../thirdPartyAPI/wacApi.service");

class AccountService {
  /**
   * Create a new account.
   * @param {Object} data - Data for the new account.
   * @returns {Promise<Object>} - The created account.
   */
  async createAccount(data) {
    const accountData = { ...data };

    // check if customer exists in WAC
    const wacLogin = await wacApiService.login();
    const wacToken = wacLogin.data.token;

    const customerMobileNumber = accountData.phone;
    const numberwithoutCountryCode = customerMobileNumber.slice(-10);
    const wacCustomer = await wacApiService.getCustomerDetails(
      numberwithoutCountryCode,
      wacToken
    );
    if (wacCustomer.data) {
      accountData.existsInWac = true;
      accountData.wacRef = wacCustomer.data.data;
    }

    const account = new Account(accountData);
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
