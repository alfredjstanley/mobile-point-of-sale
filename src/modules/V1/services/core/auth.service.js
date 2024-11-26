const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const { Account } = require("../../models/master");
const { AuthUser, Store, UserProfile } = require("../../models/core");

const { getNextSequence } = require("../../../../utils/counter.utils");
const generateToken = require("../../../../helpers/generateToken.helper");

const wacApiService = require("../thirdPartyAPI/wacApi.service");

const authService = {
  /**
   *
   * @param {object} secretOrKey
   * @returns {
   * userId: string,
   * storeId: string,
   * storeNumber: number
   * }
   */
  async retrieveUserByKey(secretOrKey) {
    const user = await AuthUser.findOne({
      secretOrKey,
      status: "ACTIVE",
    }).populate("storeId");

    if (!user) throw new Error("User not found");

    return {
      userId: user._id,
      userRole: user.role,
      storeId: user.storeId._id,
      userProfileId: user.userProfile,
      storeNumber: user.storeId.storeNumber,
    };
  },

  async getUserProfile(userId) {
    const userProfile = await UserProfile.findById(userId);
    if (!userProfile) throw new Error("User profile not found");
    return userProfile;
  },

  /**
   * Get user ID by secretOrKey
   * @param {string} secretOrKey
   * @returns {object} userId
   * @throws {Error} User not found
   * @example
   * const { userId } = await getUserId(secretOrKey);
   **/
  async getUserId(secretOrKey) {
    const user = await AuthUser.findOne({ secretOrKey }, { _id: 1 });
    if (!user) throw new Error("User not found");

    return { userId: user._id };
  },

  /**
   * Get store ID by secretOrKey
   * @param {string} secretOrKey
   * @returns {object} storeId
   * @throws {Error} User not found
   * @example
   * const { storeId } = await getStoreId(secretOrKey);
   **/
  async getStoreId(secretOrKey) {
    const user = await AuthUser.findOne({ secretOrKey }, { storeId: 1 });
    if (!user) throw new Error("User not found");

    return { storeId: user.storeId };
  },

  async register({ phoneNumber, mpin }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const extUser = await AuthUser.findOne({ phoneNumber }).session(session);
      if (extUser)
        throw new Error("Merchant already exists with this phone number.");

      const storeData = {
        status: "ACTIVE",
      };

      storeData.storeNumber = await getNextSequence("storeNumber", session);

      // check if store exists in WebAndCraft server
      const wacLogin = await wacApiService.login();
      const wacToken = wacLogin.data.token;

      // check user exists in WAC by geting user by phone number
      const wacData = await wacApiService.getMerchantDetails(
        phoneNumber.slice(-10),
        wacToken
      );

      if (wacData.isMerchantExists) {
        storeData.existsInWac = true;
        storeData.wacRef = wacData.data.data;
      }

      const newStore = new Store(storeData);
      const store = await newStore.save({ session });

      const localAccount = new Account({
        accountType: "CUSTOMER",
        name: "[Local Sales]",
        phone: "0000000000",
        storeId: store._id,
      });

      await localAccount.save({ session });

      const mPinHash = await bcrypt.hash(mpin, 10);

      const dateNow = new Date();

      const userData = {
        loginHistory: [{ loginAt: dateNow }],
        lastLoginAt: dateNow,
        secretOrKey: uuidv4(),

        mustChangePin: false,
        storeId: store._id,

        role: "Administrator",
        status: "ACTIVE",

        loginCount: 1,
        phoneNumber,
        mPinHash,
      };

      const merchant = new AuthUser(userData);
      await merchant.save({ session });

      const token = generateToken({ identifier: merchant.secretOrKey });

      await session.commitTransaction();
      session.endSession();

      return {
        message: "Merchant registered successfully",
        isMerchantExists: storeData.existsInWac ? true : false,
        accessToken: token,
        merchant,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  },

  async resetMpin({ phoneNumber, mpin }) {
    const merchant = await AuthUser.findOne({ phoneNumber });
    if (!merchant) throw new Error("Merchant not found");

    const mPinHash = await bcrypt.hash(mpin, 10);

    await AuthUser.updateOne(
      { _id: merchant._id },
      { mPinHash, mustChangePin: false, secretOrKey: uuidv4() }
    );

    return {
      message: "mPin reset successful",
    };
  },

  async verifyUser({ phoneNumber }) {
    const user = await AuthUser.findOne({
      phoneNumber,
      status: "ACTIVE",
    }).populate("userProfile");

    if (!user) throw new Error("Merchant not found");
    let userName = user.userProfile.name;
    if (userName === null) {
      userName = await Store.findOne({ _id: user.storeId })
        .select("merchantName")
        .lean();
    }
    userName = userName.merchantName;

    return {
      message: "Merchant exists",
      name: userName,
    };
  },

  async signIn({ phoneNumber, mpin }) {
    const authUser = await AuthUser.findOne({ phoneNumber });
    if (!authUser) throw new Error("User not found");

    const isMatch = await bcrypt.compare(mpin, authUser.mPinHash);
    if (!isMatch) throw new Error("Incorrect mPin");

    if (authUser.mustChangePin)
      return {
        message: "Login successful but must change mPin",
      };
    const token = generateToken({ identifier: authUser.secretOrKey });
    const responseData = await authUser.recordLogin();

    return {
      message: "Login successful",
      accessToken: token,
      merchant: responseData,
    };
  },

  async addStaff(data) {
    const { phoneNumber, mpin, storeId, role, currentUser, userProfile } = data;

    const extUser = await AuthUser.findOne({ phoneNumber, storeId });
    if (extUser)
      throw new Error("Staff already exists with this phone number.");

    const mPinHash = await bcrypt.hash(mpin, 10);

    const dateNow = new Date();

    const staffProfile = await UserProfile.create({
      username: phoneNumber,
      name: userProfile.name,
    });

    const staffData = {
      loginHistory: [{ loginAt: dateNow }],
      userProfile: staffProfile._id,

      createdBy: currentUser,
      mustChangePin: false,
      lastLoginAt: dateNow,

      secretOrKey: uuidv4(),
      status: "ACTIVE",
      loginCount: 1,

      phoneNumber,
      mPinHash,
      storeId,
      role,
    };

    const staff = new AuthUser(staffData);
    await staff.save();

    return {
      message: "Staff added successfully",
    };
  },

  async getStaffsByStoreId(storeId) {
    return await AuthUser.find({ storeId, createdBy: { $ne: null } }).populate(
      "userProfile"
    );
  },

  async getStaffById(staffId) {
    return await AuthUser.findById(staffId).populate("userProfile");
  },

  async updateStaffById(id, data) {
    try {
      const user = await AuthUser.findById(id).populate("userProfile");

      // Validate the user and store ownership
      if (!user) throw new Error("User not found");
      if (!user.storeId.equals(data.storeId))
        throw new Error("Unauthorized store access");

      const updates = {};
      let updatedUserProfile = null;

      // Update the user profile if name is provided
      if (data.name) {
        updatedUserProfile = await UserProfile.findByIdAndUpdate(
          user.userProfile._id,
          { name: data.name },
          { new: true }
        );
        updates.userProfile = updatedUserProfile;
      }

      // Hash the MPIN if provided
      if (data.mpin) {
        updates.mPinHash = await bcrypt.hash(data.mpin, 10);
      }

      // Update the main user data
      const updatedUser = await AuthUser.findByIdAndUpdate(
        id,
        { ...data, ...updates },
        { new: true }
      );

      // Ensure the updated user includes the updated profile
      if (updatedUserProfile) {
        updatedUser.userProfile = updatedUserProfile;
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating staff:", error.message);
      throw error;
    }
  },
};

module.exports = authService;
