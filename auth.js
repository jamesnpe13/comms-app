require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { generateSessionTokens } = require('./functions');

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

      generateSessionTokens(id, row, res);
    } else {
      res.status(401).json({ message: 'Incorrect password' });
    }
  });
});

router.post('/token', (req, res) => {});

module.exports = router;
