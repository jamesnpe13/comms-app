require('dotenv').config();

function checkApiKey(req, res, next) {
  const userKey = req.headers['x-api-key'];

  if (userKey && userKey === process.env.API_KEY) {
    next();
  } else {
    const err = new Error('Invalid API key');
    err.status = 403;
    next(err);
  }
}
module.exports = { checkApiKey };
