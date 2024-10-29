const { authService } = require("../../services/core");
const { responseHandler } = require("../../../../handlers");
const { AuthDTO, StaffDTO } = require("../../dtos/core");

function validatePhoneNumber(phoneNumber) {
  const phoneRegex = /^\+91\s?[6-9]\d{9}$/;
  return phoneRegex.test(phoneNumber);
}

function validateMpin(mpin) {
  const mpinRegex = /^\d{4}$/;
  return mpinRegex.test(mpin);
}

function getPhoneNumberAndMpin(req) {
  const { phoneNumber, mpin } = req.body;
  if (!phoneNumber || !mpin) {
    throw new Error("PhoneNumber and PIN required.");
  }

  if (!validatePhoneNumber(phoneNumber)) {
    throw new Error("Please enter a valid phone number");
  }

  if (!validateMpin(mpin)) {
    throw new Error("Please enter a valid MPIN");
  }

  return { phoneNumber, mpin };
}

const authController = {
  async register(req, res, next) {
    try {
      const { phoneNumber, mpin } = getPhoneNumberAndMpin(req);

      const responseData = await authService.register({ phoneNumber, mpin });
      responseHandler.sendCreatedResponse(res, responseData, AuthDTO);
    } catch (error) {
      next(error);
    }
  },

  async resetMpin(req, res, next) {
    try {
      const { phoneNumber, mpin } = getPhoneNumberAndMpin(req);

      const responseData = await authService.resetMpin({ phoneNumber, mpin });
      responseHandler.sendSuccessResponse(res, responseData);
    } catch (error) {
      next(error);
    }
  },

  async verifyUser(req, res, next) {
    try {
      const phoneNumber = req.params.phoneNumber;

      if (!phoneNumber) {
        throw new Error("PhoneNumber required.");
      }

      if (!validatePhoneNumber(phoneNumber)) {
        throw new Error("Please enter a valid phone number");
      }

      const responseData = await authService.verifyUser({ phoneNumber });
      responseHandler.sendAcceptedResponse(res, responseData);
    } catch (error) {
      next(error);
    }
  },

  async signIn(req, res, next) {
    try {
      const { phoneNumber, mpin } = getPhoneNumberAndMpin(req);

      const responseData = await authService.signIn({ phoneNumber, mpin });
      responseHandler.sendSuccessResponse(res, responseData, AuthDTO);
    } catch (error) {
      next(error);
    }
  },

  async addStaff(req, res, next) {
    try {
      const { phoneNumber, mpin, role, name } = req.body;

      if (!validatePhoneNumber(phoneNumber)) {
        throw new Error("Please enter a valid phone number");
      }

      if (!validateMpin(mpin)) {
        throw new Error("Please enter a valid MPIN");
      }

      const { storeId, userId } = req.identifier;

      const responseData = await authService.addStaff({
        currentUser: userId,
        userProfile: { name },
        phoneNumber,
        storeId,
        mpin,
        role,
      });
      responseHandler.sendCreatedResponse(res, responseData);
    } catch (error) {
      next(error);
    }
  },

  async getStaffs(req, res, next) {
    try {
      const { storeId } = req.identifier;

      const responseData = await authService.getStaffsByStoreId(storeId);
      responseHandler.sendSuccessResponse(res, responseData, StaffDTO);
    } catch (error) {
      next(error);
    }
  },

  async getStaffById(req, res, next) {
    try {
      const responseData = await authService.getStaffById(req.params.id);
      responseHandler.sendSuccessResponse(res, responseData, StaffDTO);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
