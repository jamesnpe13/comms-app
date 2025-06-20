const express = require('express');
const router = express.Router();
const db = require('./database/connection');

router.get('/', (req, res) => {
  res.send('test');
});

router.post('/insert', async (req, res) => {
  const { username, password, first_name, last_name, email } = req.body;
  try {
    await db.execute(
      `INSERT INTO users (
			username, 
			password, 
			first_name, 
			last_name, 
			email) 
			VALUES (?,?,?,?,?)`,
      [username, password, first_name, last_name, email]
    );
    res.json({ message: 'User created' });
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const [emails] = await db.execute(`SELECT username, email FROM users`);
    res.json({ users: emails });
  } catch (err) {}
});

router.delete('/delete/:username', async (req, res) => {
  const { username } = req.params;
  const { password } = req.body;

  try {
    const [rows] = await db.execute(`SELECT * FROM users WHERE username = ?`, [
      username,
    ]);
    const user = [...rows][0];

    if (password === user.password) {
      await db.execute(`DELETE FROM users WHERE username = ?`, [username]);
      res.json({ message: 'User deleted' });
    } else {
      throw new Error('Invalid password');
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;
