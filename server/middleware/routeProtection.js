// RBAC - route protection
function checkRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      const err = new Error('Access denied');
      err.status = 403;
      return next(err);
    }
    next();
  };
}

module.exports = { checkRole };
