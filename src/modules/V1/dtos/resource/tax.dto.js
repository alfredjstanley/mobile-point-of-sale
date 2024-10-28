/**
 * Tax Data Transfer Object
 *
 * @typedef {Object} TaxDTO
 * @property {string} id - The unique identifier of the tax.
 * @property {string} name - The name of the tax.
 * @property {number} rate - The rate of the tax in percentage.
 * @property {string} description - A description of the tax.
 *
 * @example
 * {
 *   "id": "671f4890b28e0cd1870dd46d",
 *   "name": "GST-0",
 *   "rate": 0,
 *   "description": "Goods and Services Tax - 0%"
 * }
 */

class TaxDTO {
  /**
   * Creates a TaxDTO instance.
   *
   * @param {Object} tax - The raw tax data from the database or service.
   * @param {string} tax._id - The unique identifier.
   * @param {string} tax.name - The name of the tax.
   * @param {number} tax.rate - The rate of the tax in percentage.
   * @param {string} tax.description - A description of the tax.
   */
  constructor(tax) {
    this.id = tax._id;
    this.name = tax.name;
    this.rate = tax.rate;
    this.description = tax.description;
  }
}

module.exports = TaxDTO;
