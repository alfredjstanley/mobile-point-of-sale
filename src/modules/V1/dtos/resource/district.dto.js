/**
 * District Data Transfer Object
 *
 * @typedef {Object} DistrictDTO
 * @property {string} id - The unique identifier of the district.
 * @property {string} name - The name of the district.
 * @property {string} code - The code of the district.
 * @property {string} stateCode - The code of the state the district belongs to.
 * @property {number} area - The area of the district in square kilometers.
 *
 * @example
 * {
 *   "id": "671f4891b28e0cd1870dd47a",
 *   "name": "Kollam",
 *   "code": "KLM",
 *   "stateCode": "671102b0ad3360e68381331c",
 *   "area": 2491,
 * }
 */

class DistrictDTO {
  /**
   * Creates a DistrictDTO instance.
   *
   * @param {Object} district - The raw district data from the database or service.
   * @param {string} district._id - The unique identifier.
   * @param {string} district.name - The name of the district.
   * @param {string} district.code - The code of the district.
   * @param {string} district.stateCode - The state code the district belongs to.
   * @param {number} district.area - The area of the district.
   */
  constructor(district) {
    this._id = district.id;
    this.name = district.name;
    this.code = district.code;
    // this.stateCode = district.stateCode;
    // this.area = district.area;
  }
}

module.exports = DistrictDTO;
