const axios = require("axios");

const config = require("../../../../configs/env.config/service.env");

const { wac } = config; // WebAndCraft API configuration

const apiClient = axios.create({
  baseURL: wac.base_url,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to log in
const login = async () => {
  try {
    const response = await apiClient.post(wac.routes.authentication, {
      username: wac.username,
      password: wac.password,
    });
    return response.data;
  } catch (error) {
    console.error("Error during login:", error.message);
    throw error;
  }
};

// Function to get customer details by mobile number
const getCustomerDetails = async (mobileNumber, token) => {
  try {
    const response = await apiClient.get(
      `${wac.routes.get_customer_by_number}=${mobileNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { isUserExists: true, data: response.data };
  } catch (error) {
    return { isUserExists: false };
  }
};

// Function to get merchant details by mobile number
const getMerchantDetails = async (mobileNumber, token) => {
  try {
    const response = await apiClient.get(
      `${wac.routes.get_merchant_by_number}=${mobileNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { isMerchantExists: true, data: response.data };
  } catch (error) {
    return { isMerchantExists: false };
  }
};

// Function to register an offline payment
const registerOfflinePayment = async (paymentDetails, token) => {
  try {
    const response = await apiClient.post(
      wac.routes.complete_offline_payment,
      paymentDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering offline payment:", error.message);
    throw error;
  }
};

module.exports = {
  login,
  getCustomerDetails,
  getMerchantDetails,
  registerOfflinePayment,
};
