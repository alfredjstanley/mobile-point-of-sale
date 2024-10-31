/**
 * Product Data Transfer Object
 *
 * @typedef {Object} ProductDTO
 * @property {string} id - Unique identifier of the product.
 * @property {string} name - Name of the product.
 * @property {number} sellingPrice - Selling price of the product.
 * @property {number} stockQuantity - Quantity of the product in stock.
 * @property {string|null} category - ID of the category the product belongs to (null if not assigned).
 * @property {string} unit - Unit ID associated with the product.
 * @property {string} tax - Tax ID associated with the product.
 * @property {boolean} taxIncluded - Indicates if the tax is included in the price.
 * @property {string} createdBy - ID of the user who created the product.
 * @property {string|null} modifiedBy - ID of the user who last modified the product (null if never modified).
 * @property {string} status - Status of the product (e.g., "ACTIVE").
 * @property {string} createdAt - Timestamp when the product was created.
 * @property {string} updatedAt - Timestamp when the product was last updated.
 *
 * @example
 * {
 *   "id": "6721d72b063a37572c63dab5",
 *   "name": "Pears3_1",
 *   "sellingPrice": 60,
 *   "stockQuantity": 40,
 *   "category": null,
 *   "unit": "671b717a1f0f78080cc5b853",
 *   "tax": "671b717a1f0f78080cc5b853",
 *   "taxIncluded": false,
 *   "createdBy": "6721d6e924a7c65cd41c5f51",
 *   "modifiedBy": null,
 *   "status": "ACTIVE",
 *   "createdAt": "2024-10-30T06:50:19.266Z",
 *   "updatedAt": "2024-10-30T06:50:19.266Z"
 * }
 */

class ProductDTO {
  /**
   * Creates a ProductDTO instance.
   *
   * @param {Object} product - The raw product data from the database or service.
   * @param {string} product._id - Unique identifier of the product.
   * @param {string} product.name - Name of the product.
   * @param {number} product.sellingPrice - Selling price of the product.
   * @param {number} product.stockQuantity - Quantity of the product in stock.
   * @param {string|null} product.category - Category ID (can be null).
   * @param {string} product.unit - Unit ID associated with the product.
   * @param {string} product.tax - Tax ID associated with the product.
   * @param {boolean} product.taxIncluded - Indicates if the tax is included in the price.
   * @param {string} product.createdBy - ID of the user who created the product.
   * @param {string|null} product.modifiedBy - ID of the user who last modified the product (can be null).
   * @param {string} product.status - Status of the product.
   * @param {string} product.createdAt - Timestamp when the product was created.
   * @param {string} product.updatedAt - Timestamp when the product was last updated.
   */
  constructor(product) {
    this.id = product._id;
    this.name = product.name;
    this.sellingPrice = product.sellingPrice;
    this.stockQuantity = product.stockQuantity;
    this.categoryId = product.category._id;
    this.categoryName = product.category.name;
    this.unitId = product.unit._id;
    this.unitName = product.unit.name;

    this.tax = {
      id: product.tax._id,
      name: product.tax.name,
      rate: product.tax.rate,
      description: product.tax.description,
    };
    this.taxIncluded = product.taxIncluded;
  }
}

module.exports = ProductDTO;
