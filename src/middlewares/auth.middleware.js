const jwt = require("jsonwebtoken");
const { app_key } = require("../configs/env.config/app.env");

// Array of fun messages to display when a user is not authorized
const displayMessages = [
  "Forbidden; don't suck your thumb boy!",
  "Access denied; go ask your mom for permission!",
  "No entry; this area is for grown-ups only!",
  "Forbidden; nice try, but no candy for you!",
  "Access blocked; better luck next time, champ!",
  "No way; keep out, this is serious business!",
  "Oops! Forbidden; not today, my friend!",
  "Hold up; you're not allowed in here, buddy!",
  "403 error; go play somewhere else!",
  "Stop right there; you're not on the VIP list!",
];

function getRandomMessage() {
  const index = Math.floor(Math.random() * displayMessages.length);
  return displayMessages[index];
}

function verifyUser(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(403).json({ message: getRandomMessage() });

  jwt.verify(token, app_key, (error, decoded) => {
    if (error) return res.status(401).json({ message: "Token is invalid" });
    req.identifier = decoded.identifier ? decoded.identifier : null;
    next();
  });
}

module.exports = verifyUser;
