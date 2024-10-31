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
 {
    _id: new ObjectId('6723279daf8d43d1f873be4c'),
    name: 'Office Supplies',
    description: 'Category for stationery and office-related items.',
    storeId: new ObjectId('6723279aaf8d43d1f873bdf1'),
    createdBy: new ObjectId('6723279aaf8d43d1f873bdf3'),
    modifiedBy: null,
    status: 'ACTIVE',
    createdAt: 2024-10-31T06:45:49.131Z,
    updatedAt: 2024-10-31T06:45:49.131Z,
    code: 'office-supplies',
    products: [ [Object], [Object] ],
    productCount: 2
}
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
    this.productCount = category.productCount;
  }
}

module.exports = CategoryDTO;
