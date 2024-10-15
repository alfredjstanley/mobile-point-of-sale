const User = require("../models/user.model");
const Merchant = require("../models/merchant.model");
const AuthUser = require("../models/authUser.model");
const UserProfile = require("../models/userProfile.model");

const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const generateToken = require("../../../helpers/generateToken.helper");

const authService = {
  async register({ phoneNumber, mpin }) {
    const extMerchant = await Merchant.findOne({ phoneNumber });
    if (extMerchant)
      throw new Error("Merchant already exists with this phone number.");

    const merchant = new Merchant({ phoneNumber, status: "ACTIVE" });
    await merchant.save();

    const mPinHash = await bcrypt.hash(mpin, 10);

    const userData = {
      merchant: merchant._id,
      secretOrKey: uuidv4(),
      mustChangePin: false,
      role: "Administrator",
      status: "ACTIVE",
      mPinHash,
    };

    const newUser = new AuthUser(userData);
    await newUser.save();

    return {
      message: "Merchant registered successfully",
      responseData: newUser,
    };
  },
  async signUp(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) throw new Error("User already exists with this email");

    const hashedPassword = await bcrypt.hash(userData.secretOrKey, 10);
    userData.secretOrKey = hashedPassword;

    const newUser = new User(userData);
    await newUser.save();

    return {
      message: "User registered successfully",
      userData: newUser,
    };
  },

  async login({ email, secretOrKey }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(secretOrKey, user.secretOrKey);
    if (!isMatch) throw new Error("Incorrect password");

    const token = generateToken({ identifier: user._id });

    const response = {
      message: "Login successful",
      accessToken: token,
      userData: user,
    };

    return response;
  },

  async addUser(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) throw new Error("User already exists with this email");

    const hashedPassword = await bcrypt.hash(userData.email, 10);
    userData.secretOrKey = hashedPassword;

    const newUser = new User(userData);
    await newUser.save();

    return {
      message: "User added successfully",
      userData: newUser,
    };
  },

  async getUserById(userId) {
    return await User.findById(userId);
  },

  async getUsers() {
    return await User.find();
  },
};

module.exports = authService;
