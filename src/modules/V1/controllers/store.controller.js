const storeService = require("../services/store.service");

/**
 * Create a new store
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const createStore = async (req, res) => {
  try {
    const store = await storeService.createStore(req.body);
    res.status(201).json(store);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get all stores
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getAllStores = async (req, res) => {
  try {
    const stores = await storeService.getAllStores(req.query);
    res.status(200).json(stores);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get a store by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getStoreById = async (req, res) => {
  try {
    const store = await storeService.getStoreById(req.params.id);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    res.status(200).json(store);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Update a store by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateStore = async (req, res) => {
  try {
    const store = await storeService.updateStore(req.params.id, req.body);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    res.status(200).json(store);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete a store by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const deleteStore = async (req, res) => {
  try {
    const store = await storeService.deleteStore(req.params.id);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    res.status(200).json({ message: "Store deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore,
};
