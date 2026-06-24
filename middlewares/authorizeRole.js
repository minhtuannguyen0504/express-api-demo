const authorizeRole = (allowedRoles) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    console.log("req day ne", !req.user.role);
    if (!req.user || !String(req.user.role)) {
      console.error(
        "Authorization Error: req.user or req.user.role is missing. Ensure authenticateToken runs first",
      );
      return res.status(403).json({ message: "Role is exist" });
    }

    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "You doesn't permission to access this resource" });
    }

    next();
  };
};

module.exports = authorizeRole;
