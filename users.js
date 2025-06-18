const express = require('express');
const router = express.Router();
const db = require('./db');
const { checkKeys } = require('./functions');
const { authenticateToken } = require('./middleware/authenticateToken');

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

// Get all users
router.get('/', authenticateToken, (req, res) => {
  const sql = `SELECT * FROM users`;

  db.all(sql, [], (err, rows) => {
    if (err) return res.json({ error: err.message });

    if (rows.length == 0) {
      return res.status(200).json({ message: 'No user entries in database' });
    }

    res.json(rows);
  });
});

// Get user by id
function getUserById(id) {
  const sql = `SELECT * FROM users where id = ?`;
  return new Promise((resolve, reject) => {
    db.get(sql, [id], (err, row) => {
      if (err) return reject(err);
      if (!row) return reject(new Error('User not found'));
      resolve(row);
    });
  });
}

router.get('/id/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id);
    res.json(user);
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Get user by username
function getUserByUsername(username) {
  const sql = `SELECT * FROM users where username = ?`;
  return new Promise((resolve, reject) => {
    db.get(sql, [username], (err, row) => {
      if (err) return reject(err);
      if (!row) return reject(new Error('User not found'));
      resolve(row);
    });
  });
}

router.get('/username/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await getUserByUsername(username);
    res.json(user);
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Update user data (username/password)
router.put('/username/:username', (req, res) => {
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

// delete user
router.delete('/username/:username', async (req, res) => {
  const { username } = req.params;
  const { password } = req.body;

  const sql = `DELETE FROM users WHERE id = ? `;

  try {
    const user = await getUserByUsername(username);

    if (password == null) return res.json({ error: 'Password cannot be null' });
    if (!password) return res.json({ error: 'Password required for deletion' });
    if (password !== user.password) {
      return res.json({ error: 'Incorrect password' });
    }

    db.run(sql, [user.id], (err) => {
      if (err) return res.json({ error: err.message });
      return res.json({
        message: `Successfully deleted userID: ${user.id}, username: ${user.username}`,
      });
    });
  } catch (err) {
    return res.json({ error: err.message });
  }
});

module.exports = router;
