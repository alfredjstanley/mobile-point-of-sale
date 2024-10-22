const { Store } = require("../../models/core");

/**
 * Create a new store
 * @param {Object} data - Store data
 * @returns {Promise<Object>} - Created store
 */
const createStore = async (data) => {
  const store = new Store(data);
  return await store.save();
};

/**
 * Get all stores
 * @param {Object} query - Query parameters
 * @returns {Promise<Array>} - List of stores
 */
const getAllStores = async (query = {}) => {
  return await Store.find(query);
};

/**
 * Get a store by ID
 * @param {String} id - Store ID
 * @returns {Promise<Object>} - Store object
 */
const getStoreById = async (id) => {
  return await Store.findById(id).populate("address.district address.state");
};

/**
 * Update a store by ID
 * @param {String} id - Store ID
 * @param {Object} data - Updated data
 * @returns {Promise<Object>} - Updated store
 */
const updateStore = async (id, data) => {
  return await Store.findByIdAndUpdate(id, data, { new: true });
};

/**
 * Delete a store by ID
 * @param {String} id - Store ID
 * @returns {Promise<Object>} - Deleted store
 */
const deleteStore = async (id) => {
  /// disable the store
  return await Store.findByIdAndUpdate(
    id,
    { status: "INACTIVE" },
    { new: true }
  );
};

module.exports = {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore,
};
