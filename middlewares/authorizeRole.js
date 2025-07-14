const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user?.role; // could be a string or array

    if (!userRoles) {
      return res.status(401).json({
        message: "User not authenticated.",
        error: true,
        success: false
      });
    }

    // Support both string and array for user roles
    const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];

    const hasRole = rolesArray.some(role => allowedRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({
        message: "Access denied. You do not have permission.",
        error: true,
        success: false
      });
    }

    next();
  };
};

module.exports = authorizeRole; 