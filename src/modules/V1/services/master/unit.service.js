const { Unit } = require("../../models/master");

class UnitService {
  async createUnit(data) {
    const unit = new Unit(data);
    const result = await unit.save();

    return {
      message: "Unit created successfully",
      unit: result,
    };
  }

  async getUnits(filter = {}) {
    return await Unit.find(filter, { storeId: 0 });
  }

  async getUnitById(id) {
    return await Unit.findById(id);
  }

  async updateUnit(id, data) {
    const unit = await Unit.findByIdAndUpdate(id, data, { new: true });

    return {
      message: "Unit updated",
      updatedUnit: unit,
    };
  }

  async deleteUnit(id) {
    await Unit.findByIdAndUpdate(id, {
      status: "INACTIVE",
    });

    return {
      message: "Unit deleted successfully",
    };
  }
}

module.exports = new UnitService();
