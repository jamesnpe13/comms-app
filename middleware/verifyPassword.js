require('dotenv').config();

const bcrypt = require('bcrypt');
const db = require('../db');

async function verifyPassword(req, res, next) {
  const { username, password } = req.body;

  // check for existence of username and password
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const sql = `SELECT * FROM users WHERE username = ?`;

  db.get(sql, username, async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: 'User not found' });

    try {
      const isMatch = await bcrypt.compare(password, row.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

      req.user = row;

      next();
    } catch (err) {
      return res.status(500).json({ error: 'Error verifying password' });
    }
  });
}

module.exports = { verifyPassword };
