const { storeService, authService } = require("../../services/core");
const { responseHandler } = require("../../../../handlers");

/**
 * Get a store by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getStoreDetails = async (req, res) => {
  try {
    const { storeId, userRole, userProfileId } = req.identifier;

    const [storeData, userProfile] = await Promise.all([
      storeService.getStoreById(storeId),
      authService.getUserProfile(userProfileId),
    ]);

    const responseData = {
      storeData,
      userProfile,
      userRole,
    };

    responseHandler.sendSuccessResponse(res, responseData);
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
    const { storeId } = req.identifier;

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
    const { storeId } = req.identifier;

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
