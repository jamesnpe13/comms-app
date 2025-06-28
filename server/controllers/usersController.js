const db = require('../database/connection');
const { newError } = require('../functions');

// POST
exports.registerUser = async (req, res, next) => {
  const { username, password, first_name, last_name, email } = req.body;
  const sql = `INSERT INTO users (
  username, 
  password, 
  first_name, 
  last_name, email) 
  VALUES (?,?,?,?,?)`;

  try {
    await db.execute(sql, [username, password, first_name, last_name, email]);
    res.json({ message: 'User created' });
  } catch (err) {
    next(err);
  }
};

// GET
exports.getAllUsers = async (req, res, next) => {
  // return non-sensitive data
  const sql = `SELECT id, username, first_name, last_name FROM users`;

  try {
    const [users] = await db.execute(sql);
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

exports.searchUsers = async (req, res, next) => {
  const { q } = req.query;
  const kw = `%${q}%`; // partial search
  const sql = `
    SELECT id, username, first_name, last_name
    FROM users
    WHERE username LIKE ?
    OR first_name LIKE ?
    OR last_name LIKE ?
  `;

  if (!q) return next(newError('Search query is required'));

  try {
    const [users] = await db.execute(sql, [kw, kw, kw]);
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  // return all user data
  const sql = `SELECT * FROM users WHERE id = ?`;

  try {
    const [rows] = await db.execute(sql, [req.user.id]);
    const user = rows[0];

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  const sql = `SELECT id, username, first_name, last_name FROM users WHERE id = ?`;
  const { id } = req.params;

  try {
    const [rows] = await db.execute(sql, [id]);
    const user = rows[0];
    if (rows.length === 0) throw new Error('No users found');

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  const sql = `SELECT id, username, first_name, last_name FROM users WHERE username = ?`;
  const { username } = req.params;

  try {
    const [rows] = await db.execute(sql, [username]);
    const user = rows[0];
    if (rows.length === 0) throw new Error('No users found');

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

// PUT
exports.updateUser = async (req, res, next) => {
  const sql = `
    UPDATE users
    SET
    username = ?,
    password = ?,
    first_name = ?,
    last_name = ?,
    email = ?
    WHERE id = ?
  `;
  const { id } = req.params;
  const { username, password, first_name, last_name, email } = req.body;

  try {
    const [result] = await db.execute(sql, [
      username,
      password, // needs bcrypt hashing middleware
      first_name,
      last_name,
      email,
      id,
    ]);

    // if there is matching user
    if (result.affectedRows === 0) throw new Error('No users found');
    // if there are changes detected
    if (result.changedRows === 0) throw new Error('No changes made');

    res.json({ message: 'User updated' });
  } catch (err) {
    next(err);
  }
};

// DELETE
exports.deleteUserById = async (req, res, next) => {
  const sql = `DELETE FROM users WHERE id = ?`;
  const { id } = req.params;

  try {
    const [result] = await db.execute(sql, [id]);

    if (result.affectedRows === 0) throw new Error('No users found');
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};
