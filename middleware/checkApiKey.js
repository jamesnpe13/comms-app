require('dotenv').config();

function checkApiKey(req, res, next) {
  const userKey = req.headers['x-api-key'];

  if (userKey && userKey === process.env.API_KEY) {
    next();
  } else {
    res.status(403).json({ error: 'Invalid API key' });
  }
}
module.exports = checkApiKey;
