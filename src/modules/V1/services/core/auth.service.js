const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const { AuthUser, Store, UserProfile } = require("../../models/core");

const { getNextSequence } = require("../../../../utils/counter.utils");
const generateToken = require("../../../../helpers/generateToken.helper");

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
  async getUserStoreIds(secretOrKey) {
    const user = await AuthUser.findOne({
      secretOrKey,
      status: "ACTIVE",
    }).populate("storeId");

    if (!user) throw new Error("User not found");

    return {
      userId: user._id,
      storeId: user.storeId._id,
      storeNumber: user.storeId.storeNumber,
    };
  },

  async getUserProfile(secretOrKey) {
    const user = await AuthUser.findOne({ secretOrKey }).populate(
      "userProfile"
    );
    if (!user) throw new Error("User not found");

    return { userProfile: user.userProfile };
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

      const storeNumber = await getNextSequence("storeNumber", session);
      const newStore = new Store({ storeNumber, status: "ACTIVE" });
      const store = await newStore.save({ session });

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
    const merchant = await AuthUser.findOne({
      phoneNumber,
      status: "ACTIVE",
    }).populate("userProfile");
    if (!merchant) throw new Error("Merchant not found");

    return {
      message: "Merchant exists",
      name: merchant.userProfile.name,
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
};

module.exports = authService;
