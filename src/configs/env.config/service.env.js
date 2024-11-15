module.exports = {
  wac: {
    base_url: process.env.WAC_BASE_URL,
    username: process.env.WAC_USERNAME,
    password: process.env.WAC_PASSWORD,
    routes: {
      authentication: "/auth/login",
      get_customer_by_number: "/customer/details?mobileNumber",
      get_merchant_by_number: "/merchant/details?mobileNumber",
      complete_offline_payment: "/payments/offline/complete",
    },
  },
};
