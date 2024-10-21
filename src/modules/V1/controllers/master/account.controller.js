const { accountService } = require("../../services/master");
const responseHandler = require("../../../../handlers/response.handler");

const { getStoreId, getUserStoreIds } = require("../../services/auth.service");

class AccountController {
  /**
   * Create a new account.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  async createAccount(req, res, next) {
    try {
      const data = req.body;
      const { storeId, userId } = await getUserStoreIds(req.identifier);

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
      const { storeId } = await getStoreId(req.identifier);

      const accounts = await accountService.getAccounts(storeId);
      responseHandler.sendSuccessResponse(res, accounts);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AccountController();
