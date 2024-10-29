const { StoreTypeService } = require("../../services/resource");

class StoreTypeController {
  async getAllStoreTypes(req, res) {
    try {
      const storeTypes = await StoreTypeService.getAllStoreTypes();
      res.status(200).json(storeTypes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getStoreTypeById(req, res) {
    try {
      const storeType = await StoreTypeService.getStoreTypeById(req.params.id);
      if (!storeType) {
        return res.status(404).json({ message: "Store Type not found" });
      }
      res.status(200).json(storeType);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createStoreType(req, res) {
    try {
      const newStoreType = await StoreTypeService.createStoreType(req.body);
      res.status(201).json(newStoreType);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateStoreType(req, res) {
    try {
      const updatedStoreType = await StoreTypeService.updateStoreType(
        req.params.id,
        req.body
      );
      if (!updatedStoreType) {
        return res.status(404).json({ message: "Store Type not found" });
      }
      res.status(200).json(updatedStoreType);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteStoreType(req, res) {
    try {
      const deletedStoreType = await StoreTypeService.deleteStoreType(
        req.params.id
      );
      if (!deletedStoreType) {
        return res.status(404).json({ message: "Store Type not found" });
      }
      res.status(200).json({ message: "Store Type deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new StoreTypeController();
