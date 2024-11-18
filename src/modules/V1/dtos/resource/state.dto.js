/**
 * State Data Transfer Object
 *
 * @typedef {Object} StateDTO
 * @property {string} id - The unique identifier of the state.
 * @property {string} name - The name of the state.
 * @property {string} code - The code of the state.
 * @property {string} capital - The capital city of the state.
 * @property {number} area - The area of the state in square kilometers.
 *
 * @example
 * {
 *   "id": "671102b0ad3360e68381331c",
 *   "name": "Kerala",
 *   "code": "KL",
 *   "capital": "Thiruvananthapuram",
 *   "area": 38863
 * }
 */

class StateDTO {
  /**
   * Creates a StateDTO instance.
   *
   * @param {Object} state - The raw state data from the database or service.
   * @param {string} state._id - The unique identifier.
   * @param {string} state.name - The name of the state.
   * @param {string} state.code - The code of the state.
   * @param {string} state.capital - The capital city of the state.
   * @param {number} state.area - The area of the state.
   */
  constructor(state) {
    this._id = state._id;
    this.name = state.name;
    this.code = state.code;
    this.capital = state.capital;
  }
}

module.exports = StateDTO;
