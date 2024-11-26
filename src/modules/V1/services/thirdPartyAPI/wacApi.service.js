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
    console.error("Error registering offline payment:", error);
    throw error;
  }
};

// Function to handle post-sales points update
const reflectUserMerchantPoints = async (
  userMobileNumber,
  merchantMobileNumber,
  paymentDetails
) => {
  try {
    // Log in to get the token
    const loginResponse = await login();
    const token = loginResponse.token; // Adjust based on actual response structure

    // Concurrently fetch customer and merchant details
    const [customerResult, merchantResult] = await Promise.all([
      getCustomerDetails(userMobileNumber, token),
      getMerchantDetails(merchantMobileNumber, token),
    ]);

    // Check if both customer and merchant exist
    if (!customerResult.isUserExists || !merchantResult.isMerchantExists) {
      throw new Error("Customer or Merchant does not exist.");
    }

    // Update payment details with retrieved data if needed
    const updatedPaymentDetails = {
      ...paymentDetails,
      user_mobile_number: userMobileNumber,
      merchant_mobile_number: merchantMobileNumber,
    };

    // Register the offline payment
    const paymentResponse = await registerOfflinePayment(
      updatedPaymentDetails,
      token
    );

    return paymentResponse;
  } catch (error) {
    console.error(
      "Error in updating user points after post-sales:",
      error.message
    );
    throw error;
  }
};

module.exports = {
  login,
  getCustomerDetails,
  getMerchantDetails,
  registerOfflinePayment,
  reflectUserMerchantPoints,
};
