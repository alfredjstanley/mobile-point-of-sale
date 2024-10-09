const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
};

module.exports = authorize;


// // sample use of the authorize middleware
// router.post('/add-user', authMiddleware, authorize(['Admin', 'Super-Admin']), userController.addUser);