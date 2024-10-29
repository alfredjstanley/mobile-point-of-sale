const { accountService } = require("../../services/master");
const { responseHandler } = require("../../../../handlers");
const { AccountDTO } = require("../../dtos/master");

class AccountController {
  /**
   * Create a new account.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  async createAccount(req, res, next) {
    try {
      const data = req.body;
      const { storeId, userId } = req.identifier;

      data.storeId = storeId;
      data.createdBy = userId;

      const account = await accountService.createAccount(data);
      responseHandler.sendCreatedResponse(res, account);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all accounts.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  async getAccounts(req, res, next) {
    try {
      const { storeId } = req.identifier;

      const accounts = await accountService.getAccounts(storeId);
      responseHandler.sendSuccessResponse(res, accounts, AccountDTO);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AccountController();
