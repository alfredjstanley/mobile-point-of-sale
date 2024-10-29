/**
 * Account Data Transfer Object
 *
 * @typedef {Object} AccountDTO
 * @property {string} id - Unique identifier of the account.
 * @property {string} name - Name associated with the account.
 * @property {string} phone - Phone number of the account holder.
 * @property {string} email - Email address of the account holder.
 * @property {string} address - Physical address of the account holder.
 * @property {number} creditLimit - Credit limit for the account.
 * @property {number} creditDuration - Credit duration in days.
 * @property {number} balance - Current balance of the account.
 * @property {string} accountType - Type of the account (e.g., "CUSTOMER").
 * @property {string} storeId - Store ID associated with the account.
 * @property {string} createdBy - ID of the user who created the account.
 * @property {string|null} modifiedBy - ID of the user who last modified the account (null if never modified).
 * @property {string} createdAt - Timestamp when the account was created.
 * @property {string} updatedAt - Timestamp when the account was last updated.
 *
 * @example
 * {
 *   "id": "6720e23f7c01180a464a30dc",
 *   "name": "alfredjstanley",
 *   "phone": "+919562626335",
 *   "email": "john.doe@example.com",
 *   "address": "123 Main St, Anytown",
 *   "creditLimit": 500,
 *   "creditDuration": 0,
 *   "balance": 0,
 *   "accountType": "CUSTOMER",
 *   "storeId": "6720e2277c01180a464a30d4",
 *   "createdBy": "6720e2287c01180a464a30d6",
 *   "modifiedBy": null,
 *   "createdAt": "2024-10-29T13:25:19.797Z",
 *   "updatedAt": "2024-10-29T13:25:19.797Z"
 * }
 */

class AccountDTO {
  /**
   * Creates an AccountDTO instance.
   *
   * @param {Object} account - The raw account data from the database or service.
   * @param {string} account._id - Unique identifier of the account.
   * @param {string} account.name - Name associated with the account.
   * @param {string} account.phone - Phone number of the account holder.
   * @param {string} account.email - Email address of the account holder.
   * @param {string} account.address - Physical address of the account holder.
   * @param {number} account.creditLimit - Credit limit for the account.
   * @param {number} account.creditDuration - Credit duration in days.
   * @param {number} account.balance - Current balance of the account.
   * @param {string} account.accountType - Type of the account.
   * @param {string} account.storeId - Store ID associated with the account.
   * @param {string} account.createdBy - ID of the user who created the account.
   * @param {string|null} account.modifiedBy - ID of the user who last modified the account.
   * @param {string} account.createdAt - Timestamp when the account was created.
   * @param {string} account.updatedAt - Timestamp when the account was last updated.
   */
  constructor(account) {
    this.id = account._id;
    this.name = account.name;
    this.phone = account.phone;
    this.email = account.email;
    this.address = account.address;
    this.creditLimit = account.creditLimit;
    this.creditDuration = account.creditDuration;
    this.balance = account.balance;
    this.accountType = account.accountType;
  }
}

module.exports = AccountDTO;
