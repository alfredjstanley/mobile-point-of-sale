const mongoose = require("mongoose");
const { SavedOrder } = require("../../models/management");
const { getNextSequence } = require("../../../../utils/counter.utils");

const SAVED_ORDER_PREFIX = "SORD";

class SavedOrderService {
  async createSavedOrder(data) {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        // **Generate a unique order number**
        const orderNumberType = `${SAVED_ORDER_PREFIX}-${data.storeId}`;
        let orderNumber = await getNextSequence(orderNumberType, session);

        // Format order number to 4 digits and store number to 2 digits
        orderNumber = orderNumber.toString().padStart(4, "0");
        data.storeNumber = data.storeNumber.toString().padStart(2, "0");

        // Get last two digits of the year
        const year = new Date().getFullYear().toString().slice(-2);
        data.orderNumber = `${SAVED_ORDER_PREFIX}-${year}-${data.storeNumber}-${orderNumber}`; // e.g., SORD-21-01-0001

        // Create the saved order
        const savedOrder = new SavedOrder(data);
        await savedOrder.save({ session });
      });
      session.endSession();
      return {
        message: "Saved order created successfully",
        orderNumber: data.orderNumber,
      };
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getAllSavedOrders(filter = {}) {
    try {
      const savedOrders = await SavedOrder.find(filter).lean();

      return savedOrders;
    } catch (error) {
      throw error;
    }
  }

  async getSavedOrderById(id) {
    try {
      const savedOrder = await SavedOrder.findById(id).lean();

      if (savedOrder) return savedOrder;

      throw new Error("Saved order not found");
    } catch (error) {
      throw error;
    }
  }

  async updateSavedOrder(id, data) {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const savedOrder = await SavedOrder.findById(id).session(session);
        if (!savedOrder) {
          throw new Error("Saved order not found");
        }

        // Update only the fields provided in data
        Object.keys(data).forEach((key) => {
          savedOrder[key] = data[key];
        });

        await savedOrder.save({ session });
      });
      session.endSession();
      return { message: "Saved order updated successfully" };
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  }
}

module.exports = new SavedOrderService();
