const storeService = require("../services/store.service");

const { getUserStoreIds } = require("../services/auth.service");
const responseHandler = require("../../../handlers/response.handler");

/**
 * Get a store by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getStoreDetails = async (req, res) => {
  try {
    const { storeId } = await getUserStoreIds(req.identifier);

    const storeData = await storeService.getStoreById(storeId);
    if (!storeData) return res.status(404).json({ error: "Store not found" });

    responseHandler.sendSuccessResponse(res, storeData);
  } catch (error) {
    responseHandler.sendFailureResponse(res, error.message);
  }
};

/**
 * Update a store by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateStore = async (req, res) => {
  try {
    const { storeId } = await getStoreId(req.identifier);

    const store = await storeService.updateStore(storeId, req.body);
    if (!store) return res.status(404).json({ error: "Store not found" });

    responseHandler.sendSuccessResponse(res, store);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete ( soft delete ) a store by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const deleteStore = async (req, res) => {
  try {
    const { storeId } = await getStoreId(req.identifier);

    const store = await storeService.deleteStore(storeId);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    res.status(200).json({ message: "Store deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getStoreDetails,
  updateStore,
  deleteStore,
};
