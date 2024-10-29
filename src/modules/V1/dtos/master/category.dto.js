/**
 * Category Data Transfer Object
 *
 * @typedef {Object} CategoryDTO
 * @property {string} id - Unique identifier of the category.
 * @property {string} name - Name of the category.
 * @property {string} code - Code representing the category.
 * @property {string} description - Description of the category.
 * @property {string} storeId - Store ID associated with the category.
 * @property {string} createdBy - ID of the user who created the category.
 * @property {string|null} modifiedBy - ID of the user who last modified the category (null if never modified).
 * @property {string} status - Status of the category (e.g., "ACTIVE").
 * @property {string} createdAt - Timestamp when the category was created.
 * @property {string} updatedAt - Timestamp when the category was last updated.
 *
 * @example
 * {
 *   "id": "6720d5d52896d05d3e9fc51e",
 *   "name": "Toileteries",
 *   "code": "Toileteries",
 *   "description": "Category for Toileteries products.",
 *   "storeId": "6720d41f1243d160874fd4b5",
 *   "createdBy": "6720d41f1243d160874fd4b7",
 *   "modifiedBy": null,
 *   "status": "ACTIVE",
 *   "createdAt": "2024-10-29T12:32:21.308Z",
 *   "updatedAt": "2024-10-29T12:32:21.308Z"
 * }
 */

class CategoryDTO {
  /**
   * Creates a CategoryDTO instance.
   *
   * @param {Object} category - The raw category data from the database or service.
   * @param {string} category._id - Unique identifier of the category.
   * @param {string} category.name - Name of the category.
   * @param {string} category.code - Code representing the category.
   * @param {string} category.description - Description of the category.
   * @param {string} category.storeId - Store ID associated with the category.
   * @param {string} category.createdBy - ID of the user who created the category.
   * @param {string|null} category.modifiedBy - ID of the user who last modified the category.
   * @param {string} category.status - Status of the category.
   * @param {string} category.createdAt - Timestamp when the category was created.
   * @param {string} category.updatedAt - Timestamp when the category was last updated.
   */
  constructor(category) {
    this.id = category._id;
    this.name = category.name;
    this.code = category.code;
    this.description = category.description;
  }
}

module.exports = CategoryDTO;
