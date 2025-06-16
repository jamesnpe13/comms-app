const express = require('express');
const router = express.Router();
const db = require('./db');
const { checkKeys } = require('./functions');

// User register
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;

  db.run(sql, [username, password], (err) => {
    if (err) {
      console.log(err.message);
      return res
        .status(500)
        .json({ error: 'Failed to register user', message: err.message });
    }
    res.status(201).json({ message: 'User registered', userId: this.lastID });
  });
});

// User login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT * FROM users WHERE username = ?`;

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
      res.status(200).json({ message: 'Login success', user: row });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// Get all users
router.get('/users', (req, res) => {
  const sql = `SELECT * FROM users`;

  db.all(sql, [], (err, rows) => {
    if (err) res.status(401).json({ error: err.message });

    if (rows.length == 0)
      res.status(200).json({ message: 'No user entries in database' });

    res.json(rows);
  });
});

// Get user by username
router.get('/users/:username', (req, res) => {
  const { username } = req.params;
  const sql = `SELECT * FROM users where username = ?`;

  db.get(sql, [username], (err, row) => {
    if (err) res.status(401).json({ error: err.message });

    if (!row) res.status(404).json({ error: 'No user found' });

    res.json(row);
  });
});

// Update user data (username/password)
router.put('/:username/update', (req, res) => {
  const targetUser = req.params.username;
  const { username, password } = req.body;

  const sqlGetUser = `SELECT * FROM users WHERE username = ?`;
  const sqlUpdateUser = `UPDATE users SET username = ?, password = ? WHERE id = ?`;

  db.get(sqlGetUser, [targetUser], (err, row) => {
    if (err) return res.json({ error: err.message });

    if (!row) return res.json({ error: 'User not found' });

    const user = row;
    const updatedUser = { ...user };

    if (username) updatedUser.username = username;
    if (password) updatedUser.password = password;

    if (checkKeys(user, updatedUser)) {
      return res.json({ message: 'Nothing to update' });
    }

    db.run(
      sqlUpdateUser,
      [updatedUser.username, updatedUser.password, updatedUser.id],
      (err) => {
        if (err) {
          let message;
          if (
            err.message ==
            'SQLITE_CONSTRAINT: UNIQUE constraint failed: users.username'
          ) {
            message = 'Username already exist';
          }
          return res.json({ error: message });
        }

        return res.json({ message: 'Update success' });
      }
    );
  });
});

module.exports = router;
