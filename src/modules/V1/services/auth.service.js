const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const generateToken = require("../../../helpers/generateToken.helper");

const authService = {
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
