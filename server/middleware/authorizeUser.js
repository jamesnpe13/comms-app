const { newError } = require('../functions');

async function authorizeUser(req, res, next) {
  const userId = String(req.user.id);
  const paramsId = String(req.params.id);

  if (userId !== paramsId) {
    return next(newError('Unauthorized action'));
  }

  console.log('acces granted');
  next();
}

module.exports = { authorizeUser };
