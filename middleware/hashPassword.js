require('dotenv').config();

const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashPassword(req, res, next) {
  try {
    // if password is blank
    if (!req.body.password) {
      return res.status(400).json({ error: 'Password required' });
    }

    const hashed = await bcrypt.hash(req.body.password, saltRounds); // hash plain password
    req.body.password = hashed; // replace req.body.password with hashed value

    next();
  } catch (err) {
    res.status(500).json({ error: 'Failed to hash password' });
  }
}

module.exports = { hashPassword };
