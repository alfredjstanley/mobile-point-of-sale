const jwt = require("jsonwebtoken");
const { app_key } = require("../configs/env.config/app.env");

function generateToken(payload) {
  return jwt.sign(payload, app_key, {
    expiresIn: "1d",
  });
}

module.exports = generateToken;
