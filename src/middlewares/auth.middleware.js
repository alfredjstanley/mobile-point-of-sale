const jwt = require("jsonwebtoken");
const { app_key } = require("../configs/env.config/app.env");
const { getUserStoreIds } = require("../modules/V1/services/core/auth.service");

async function verifyUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(403).json({ message: "Access denied" });

  jwt.verify(token, app_key, async (error, decoded) => {
    if (error) return res.status(401).json({ message: "Invalid token" });

    try {
      req.identifier = await getUserStoreIds(decoded.identifier);
      next();
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });
}

module.exports = verifyUser;
