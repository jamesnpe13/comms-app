const jwt = require('jsonwebtoken');
const db = require('../database/connection');
const { issueSessionTokens } = require('../functions');
exports.userLogin = async (req, res) => {
  const { id } = req.user;
  const { user } = req;

  issueSessionTokens(id, user, res);
};

exports.refreshSessionTokens = async (req, res) => {
  // get refresh token from cookie
  const cookieRefreshToken = req.cookies.refreshToken;

  const sqlGetRefreshToken = `SELECT token FROM refresh_tokens WHERE user_id = ?`;
  const sqlGetUserById = `SELECT * FROM users WHERE id = ?`;
  let decoded;

  if (cookieRefreshToken == null) return res.sendStatus(401);

  try {
    decoded = jwt.verify(cookieRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log(decoded);
  } catch (err) {
    console.log(err.message);
  }

  if (decoded == null) return res.json({ error: 'Token invalid' });

  try {
    const [user] = await db.execute(sqlGetUserById, [decoded.id]);
    issueSessionTokens(decoded.id, user[0], res);
  } catch (error) {
    res.json({ error: error.message });
  }
};
