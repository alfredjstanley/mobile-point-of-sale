const { Tax } = require("../../models/resource");

/**
 * Get all taxes
 * @returns {Promise<Array<Tax>>}
 */
const getAllTaxes = async () => {
  return await Tax.find();
};

/**
 * Get tax by ID
 * @param {number} id - Tax ID
 * @returns {Promise<Tax>}
 */
const getTaxById = async (id) => {
  return await Tax.findById(id);
};

/**
 * Create a new tax
 * @param {Object} taxData - Data for the new tax
 * @returns {Promise<Tax>}
 */
const createTax = async (taxData) => {
  return await Tax.create(taxData);
};

/**
 * Update an existing tax
 * @param {number} id - Tax ID
 * @param {Object} taxData - Updated data for the tax
 * @returns {Promise<Tax>}
 */
const updateTax = async (id, taxData) => {
  const tax = await Tax.findById(id);
  if (!tax) {
    throw new Error("Tax not found");
  }
  return await tax.update(taxData);
};

/**
 * Delete a tax
 * @param {number} id - Tax ID
 * @returns {Promise<void>}
 */
const deleteTax = async (id) => {
  const tax = await Tax.findById(id);
  if (!tax) {
    throw new Error("Tax not found");
  }
  await tax.deleteOne(id);
};

module.exports = {
  getAllTaxes,
  getTaxById,
  createTax,
  updateTax,
  deleteTax,
};
