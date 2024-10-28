const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const { AuthUser, Store, UserProfile } = require("../../models/core");
const generateToken = require("../../../../helpers/generateToken.helper");

const authService = {
  /**
   *
   * @param {object} secretOrKey
   * @returns {
   * storeId: string,
   * userId: string
   * }
   */
  async getUserStoreIds(secretOrKey) {
    const user = await AuthUser.findOne(
      { secretOrKey, status: "ACTIVE" },
      { storeId: 1 }
    );
    if (!user) throw new Error("User not found");

    return { storeId: user.storeId, userId: user._id };
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
    const extUser = await AuthUser.findOne({ phoneNumber });
    if (extUser)
      throw new Error("Merchant already exists with this phone number.");

    const newStore = new Store({ status: "ACTIVE" });
    const store = await newStore.save();

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
    await merchant.save();

    const token = generateToken({ identifier: merchant.secretOrKey });

    return {
      message: "Merchant registered successfully",
      accessToken: token,
      userRole: merchant.role,
      userStatus: merchant.status,
    };
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
    const merchant = await AuthUser.findOne({ phoneNumber }).populate(
      "userProfile"
    );
    if (!merchant) throw new Error("Merchant not found");

    return {
      message: "Merchant exists",
      firstName: merchant.userProfile.firstName,
      username: merchant.userProfile.username,
      userStatus: merchant.status,
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
      userRole: responseData.role,
      userStatus: responseData.status,
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
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
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
      staffData: staff,
    };
  },

  async getStaffsByStoreId(storeId) {
    return await AuthUser.find({ storeId, createdBy: { $ne: null } });
  },

  async getStaffById(staffId) {
    return await AuthUser.findById(staffId);
  },
};

module.exports = authService;
