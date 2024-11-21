/**
 * Auth Data Transfer Object
 *
 * @typedef {Object} AuthDTO
 * @property {string} message - Message associated with the auth response.
 * @property {Object} merchant - Merchant information.
 * @property {string} merchant.id - Unique identifier of the merchant.
 * @property {string} merchant.storeId - Store ID associated with the merchant.
 * @property {string} merchant.phoneNumber - Merchant's phone number.
 * @property {string} merchant.role - Role of the merchant.
 * @property {string|null} merchant.createdBy - Creator of the merchant account.
 * @property {string} merchant.status - Status of the merchant account.
 * @property {string} merchant.lastLoginAt - Timestamp of the last login.
 * @property {number} merchant.loginCount - Number of times the merchant has logged in.
 * @property {Array<Object>} merchant.loginHistory - Login history records.
 * @property {string} merchant.loginHistory[].loginAt - Timestamp of the login.
 * @property {string} merchant.loginHistory[].id - Unique identifier of the login history record.
 * @property {string} merchant.userProfile - User profile ID.
 * @property {string} merchant.createdAt - Timestamp when the merchant was created.
 * @property {string} merchant.updatedAt - Timestamp when the merchant was last updated.
 * @property {string} accessToken - Access token for authentication.
 *
 * @example
 * {
 *   "message": "Merchant registered successfully",
 *   "merchant": {
 *     "id": "67205cceb71931c2e1da0ce3",
 *     "storeId": "67205cceb71931c2e1da0ce1",
 *     "phoneNumber": "+917907396902",
 *     "role": "Administrator",
 *     "createdBy": null,
 *     "status": "ACTIVE",
 *     "lastLoginAt": "2024-10-29T03:55:58.914Z",
 *     "loginCount": 1,
 *     "loginHistory": [
 *       {
 *         "loginAt": "2024-10-29T03:55:58.914Z",
 *         "id": "67205cceb71931c2e1da0ce4"
 *       }
 *     ],
 *     "userProfile": "67205cceb71931c2e1da0ce5",
 *     "createdAt": "2024-10-29T03:55:59.168Z",
 *     "updatedAt": "2024-10-29T03:55:59.168Z"
 *   },
 *   "accessToken": "your-access-token",
 * }
 */

class AuthDTO {
  /**
   * Creates an AuthDTO instance.
   *
   * @param {Object} data - The raw auth response data.
   * @param {string} data.message - Message from the auth response.
   * @param {Object} data.merchant - Raw merchant data.
   * @param {string} data.accessToken - Access token.
   * @param {string} data.isMerchantExists - Access token.
   *
   */
  constructor(data) {
    this.message = data.message;
    this.accessToken = data.accessToken;
    this.isMerchantExists = data.isMerchantExists;
    this.userType = data.merchant.role;
  }
}

module.exports = AuthDTO;
