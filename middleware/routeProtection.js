function adminProtect(req, res, next) {
  const { role } = req.user;
  console.log(role);
  if (role !== 'admin') return res.json({ error: 'Access denied' });
  next();
}

function memberProtect(req, res, next) {
  const { role } = req.user;
  if (role !== 'member') return res.json({ error: 'Access denied' });
  next();
}

module.exports = { adminProtect, memberProtect };
