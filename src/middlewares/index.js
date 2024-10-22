const appMiddleware = require("./app.middleware");
const authMiddleware = require("./auth.middleware");
const rbacMiddleware = require("./rbac.middleware");

module.exports = {
  appMiddleware,
  authMiddleware,
  rbacMiddleware,
};
