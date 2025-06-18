require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // get access token from req.headers
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(authHeader);
  console.log(token);
  console.log(process.env.ACCESS_TOKEN_SECRET);

  if (token == null) return res.json({ error: 'No token provided' });

  console.log(
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.json({ error: err.message });
      req.user = user;
      console.log(user);
      next();
    })
  );
}

module.exports = { authenticateToken };
