const jwt = require("jsonwebtoken");
const { app_key } = require("../configs/env.config/app.env");

function verifyUser(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(403).json({ message: "Access denied" });

  jwt.verify(token, app_key, (error, decoded) => {
    if (error) return res.status(401).json({ message: "Invalid token" });
    req.identifier = decoded.identifier ? decoded.identifier : null;
    next();
  });
}

module.exports = verifyUser;
