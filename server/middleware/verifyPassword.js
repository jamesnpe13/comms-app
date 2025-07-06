require('dotenv').config();

const bcrypt = require('bcrypt');
const db = require('../database/connection');
const { newError, setError } = require('../functions');

async function verifyPassword(req, res, next) {
  const { username, password } = req.body;
  const sql = `SELECT * FROM users WHERE BINARY username = ?`;

  // check for existence of username and password
  if (!username || !password) {
    return next(newError('Username and password required', 400));
  }

  try {
    const [user] = await db.execute(sql, [username]);

    if (user.length === 0) return next(newError('User not found', 401));

    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) return next(newError('Invalid password', 401));

    req.user = user[0];

    next();
  } catch (err) {
    next(setError('Error verifying password'));
  }
}

module.exports = { verifyPassword };
