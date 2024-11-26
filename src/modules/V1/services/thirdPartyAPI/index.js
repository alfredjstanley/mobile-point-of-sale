const {
  login,
  registerOfflinePayment,
  getCustomerDetails,
  getMerchantDetails,
} = require("./wacApi.service");

const Log = require("../../models/services/wacLog.model");
// const User = require("./UserSchema");
// const Merchant = require("./MerchantSchema");

const reflectUserMerchantPointsInWac = async (store, payload) => {
  let logEntry;
  let userMobileNumber = payload.customerNumber;
  let merchantMobileNumber = store.phoneNumber;

  // take last 10 digits of the mobile number
  userMobileNumber = userMobileNumber.slice(-10);
  merchantMobileNumber = merchantMobileNumber.slice(-10);

  const paymentDetails = {
    user_mobile_number: userMobileNumber,
    merchant_mobile_number: merchantMobileNumber,
    amount: payload.totalAmount,
    invoice_id: payload.data.billNumber,
    payment_mode: payload.paymentType,
  };

  // const merchantMobileNumber, paymentDetails } = payload;

  try {
    // 1. Log in and get token
    const loginResponse = await login();

    const token = loginResponse.data.token;

    // 2. Call the offline payment API
    const paymentResponse = await registerOfflinePayment(paymentDetails, token);

    // 3. Save log entry
    logEntry = new Log({
      userMobileNumber,
      merchantMobileNumber,
      paymentDetails,
      status: "SUCCESS",
      response: paymentResponse,
    });
    await logEntry.save();

    // 4. Fetch updated user and merchant details
    const [customerResult, merchantResult] = await Promise.all([
      getCustomerDetails(userMobileNumber, token),
      getMerchantDetails(merchantMobileNumber, token),
    ]);

    if (customerResult.isUserExists) {
      // 5. Save user details to User collection
      await User.findOneAndUpdate(
        { mobileNumber: userMobileNumber },
        { details: customerResult.data },
        { upsert: true, new: true }
      );
    }

    if (merchantResult.isMerchantExists) {
      // 6. Save merchant details to Merchant collection
      await Merchant.findOneAndUpdate(
        { mobileNumber: merchantMobileNumber },
        { details: merchantResult.data },
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.error("Error in offline payment flow:", error);

    // Update log entry in case of failure
    if (logEntry) {
      // logEntry.status = "FAILURE";
      // logEntry.errorMessage = error.message;
      // await logEntry.save();
    } else {
      // Save log entry for failures occurring before log creation
      // await Log.create({
      //   userMobileNumber,
      //   merchantMobileNumber,
      //   paymentDetails,
      //   status: "FAILURE",
      //   errorMessage: error.message,
      // });
    }
  }
};

module.exports = { reflectUserMerchantPointsInWac };
