const { StoreType } = require("../../models/resource");

class StoreTypeService {
  async createStoreType(data) {
    try {
      const storeType = new StoreType(data);
      await storeType.save();
      return storeType;
    } catch (error) {
      throw new Error("Error creating store type: " + error.message);
    }
  }

  async getStoreTypeById(id) {
    try {
      const storeType = await StoreType.findById(id);
      if (!storeType) {
        throw new Error("Store type not found");
      }
      return storeType;
    } catch (error) {
      throw new Error("Error fetching store type: " + error.message);
    }
  }

  async updateStoreType(id, data) {
    try {
      const storeType = await StoreType.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!storeType) {
        throw new Error("Store type not found");
      }
      return storeType;
    } catch (error) {
      throw new Error("Error updating store type: " + error.message);
    }
  }

  async deleteStoreType(id) {
    try {
      const storeType = await StoreType.findByIdAndDelete(id);
      if (!storeType) {
        throw new Error("Store type not found");
      }
      return storeType;
    } catch (error) {
      throw new Error("Error deleting store type: " + error.message);
    }
  }

  async getAllStoreTypes() {
    try {
      const storeTypes = await StoreType.find();
      return storeTypes;
    } catch (error) {
      throw new Error("Error fetching store types: " + error.message);
    }
  }
}

module.exports = new StoreTypeService();
