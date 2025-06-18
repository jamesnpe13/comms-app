require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // get access token from req.headers
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // check if there is an access token included in headers
  if (token == null) return res.json({ error: 'No token provided' });

  // verify access token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.json({ error: err.message });

    // attaches decoded user to req.body
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
