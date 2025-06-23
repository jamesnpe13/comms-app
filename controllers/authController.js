const jwt = require('jsonwebtoken');
const db = require('../database/connection');
const {
  issueSessionTokens,
  newError,
  setError,
  clearRefreshTokenCookie,
} = require('../functions');

exports.userLogin = async (req, res, next) => {
  const { id } = req.user;
  const { user } = req;
  const { session_only } = req.body;

  clearRefreshTokenCookie(res);
  issueSessionTokens(id, user, res, session_only);
};

exports.userLogout = async (req, res, next) => {
  const sql = `DELETE FROM refresh_tokens WHERE user_id = ?`;
  try {
    const [result] = await db.execute(sql, [req.user.id]);
    if (result.affectedRows === 0) {
      throw new Error('No refresh tokens in database');
    }
    clearRefreshTokenCookie(res);
    res.json({ message: 'User logged out' });
  } catch (err) {
    return next(err);
  }
};

exports.refreshSessionTokens = async (req, res, next) => {
  // get refresh token from cookie
  const cookieRefreshToken = req.cookies.refreshToken;

  const sqlGetRefreshToken = `SELECT token FROM refresh_tokens WHERE user_id = ?`;
  const sqlGetUserById = `SELECT * FROM users WHERE id = ?`;
  let decoded;

  if (cookieRefreshToken == null) return res.sendStatus(401);

  try {
    decoded = jwt.verify(cookieRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    console.log(decoded);

    if (decoded == null) return res.json({ error: 'Token invalid' });

    const [dbTokenResult] = await db.execute(sqlGetRefreshToken, [decoded.id]);
    const dbToken = dbTokenResult[0]?.token;

    if (!dbToken || dbToken !== cookieRefreshToken) {
      return next(newError('Refresh token mismatch', 403));
    }

    const [user] = await db.execute(sqlGetUserById, [decoded.id]);
    issueSessionTokens(decoded.id, user[0], res);
  } catch (err) {
    next(err);
  }
};
