require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { issueSessionTokens } = require('./functions');
const { authenticateToken } = require('./middleware/authenticateToken');
const { verifyPassword } = require('./middleware/verifyPassword');

const router = express.Router();

// User login
router.post('/login', verifyPassword, (req, res) => {
  const { id } = req.user;
  const { user } = req;

  // issue access token and refresh token
  issueSessionTokens(id, user, res);
});

router.post('/refresh', async (req, res) => {
  // get refresh token from cookie
  const cookieRefreshToken = req.cookies.refreshToken;

  const sqlGetRefreshToken = `SELECT token FROM refresh_tokens WHERE user_id = ?`;
  const sqlGetUserById = `SELECT * FROM users WHERE id = ?`;
  let decoded;

  if (cookieRefreshToken == null) return res.sendStatus(401);

  try {
    decoded = jwt.verify(cookieRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    console.log(err.message);
  }

  // get the user
  if (decoded == null) return res.json({ error: 'Token invalid' });

  db.get(sqlGetUserById, [decoded.id], (err, row) => {
    if (err) return res.json({ error: err.message });
    const userId = decoded.id;
    const user = row;

    try {
      issueSessionTokens(userId, user, res);
    } catch (err) {
      res.json({ error: err.message });
    }
  });
});

module.exports = router;
