module.exports = function (requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next(); // continue to the route
  };
};
