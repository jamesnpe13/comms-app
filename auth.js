require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const ms = require('ms');
const db = require('./db');
const { generateAccessToken, generateRefreshToken } = require('./functions');

const router = express.Router();

// User login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT * FROM users WHERE username = ?`;

  // authenticate user credentials
  db.get(sql, [username], (err, row) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: 'Database error', message: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (password === row.password) {
      // issue access token and refresh token
      const id = row.id;
      const accessToken = generateAccessToken(row);
      const refreshToken = generateRefreshToken(row);

      const sqlRefreshTokenToDB = `
      INSERT INTO refresh_tokens (user_id, token) 
      VALUES (?, ?) 
      ON CONFLICT(user_id) 
      DO UPDATE SET token = excluded.token, created_at = CURRENT_TIMESTAMP;
      `;

      // save refresh token with id to database
      db.run(sqlRefreshTokenToDB, [id, refreshToken], (err) => {
        if (err) {
          return res.status(500).json({
            error: 'Failed to save refresh token to database',
            message: err.message,
          });
        }
      });

      // save refresh token to cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: ms(process.env.REFRESH_TOKEN_EXPIRES_IN),
      });

      return res.status(200).json({
        message: 'Login success',
        user: { username: row.username, id: id },
        accessToken: accessToken, // attach access token to res - this goes to client memory
      });
    } else {
      res.status(401).json({ message: 'Incorrect password' });
    }
  });
});

module.exports = router;
