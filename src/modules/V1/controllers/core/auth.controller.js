const { authService } = require("../../services/core");
const { responseHandler } = require("../../../../handlers");

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
  async register(req, res) {
    try {
      const { phoneNumber, mpin } = getPhoneNumberAndMpin(req);

      const responseData = await authService.register({ phoneNumber, mpin });
      responseHandler.sendCreatedResponse(res, responseData);
    } catch (error) {
      responseHandler.sendFailureResponse(res, error.message);
    }
  },

  async resetMpin(req, res) {
    try {
      const { phoneNumber, mpin } = getPhoneNumberAndMpin(req);

      const responseData = await authService.resetMpin({ phoneNumber, mpin });
      responseHandler.sendSuccessResponse(res, responseData);
    } catch (error) {
      responseHandler.sendFailureResponse(res, error.message);
    }
  },

  async verifyUser(req, res) {
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
      responseHandler.sendFailureResponse(res, error.message);
    }
  },

  async signIn(req, res) {
    try {
      const { phoneNumber, mpin } = getPhoneNumberAndMpin(req);

      const responseData = await authService.signIn({ phoneNumber, mpin });
      responseHandler.sendSuccessResponse(res, responseData);
    } catch (error) {
      responseHandler.sendFailureResponse(res, error.message);
    }
  },

  async addStaff(req, res) {
    try {
      const { phoneNumber, mpin, role, userProfile } = req.body;

      if (!phoneNumber || !mpin || !role || !userProfile) {
        throw new Error(
          "PhoneNumber, MPIN, Store ID, Role, userProfile and Current User required."
        );
      }
      if (!validatePhoneNumber(phoneNumber)) {
        throw new Error("Please enter a valid phone number");
      }

      if (!validateMpin(mpin)) {
        throw new Error("Please enter a valid MPIN");
      }

      const { storeId, userId } = req.identifier;

      const responseData = await authService.addStaff({
        currentUser: userId,
        userProfile,
        phoneNumber,
        storeId,
        mpin,
        role,
      });
      responseHandler.sendCreatedResponse(res, responseData);
    } catch (error) {
      responseHandler.sendFailureResponse(res, error.message);
    }
  },

  async getStaffs(req, res) {
    try {
      const { storeId } = req.identifier;

      const responseData = await authService.getStaffsByStoreId(storeId);
      responseHandler.sendSuccessResponse(res, responseData);
    } catch (error) {
      responseHandler.sendFailureResponse(res, error.message);
    }
  },

  async getStaffById(req, res) {
    try {
      const responseData = await authService.getStaffById(req.params.id);
      responseHandler.sendSuccessResponse(res, responseData);
    } catch (error) {
      responseHandler.sendFailureResponse(res, error.message);
    }
  },
};

module.exports = authController;
