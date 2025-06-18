const jwt = require('jsonwebtoken');
const ms = require('ms');
const db = require('./db');

// Compare function object A and object B keys
function checkKeys(a, b) {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (let key of keysA) {
    if (a[key] !== b[key]) return false;
  }

  return true;
}

// generate access token
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });
}

// generate refresh token
function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });
}

/*
generate session tokens (save new refresh token to db, save new refresh token to client cookie, issue new access token and send to res.json )
*/
function generateSessionTokens(userId, userObject, res) {
  const accessToken = generateAccessToken(userObject);
  const refreshToken = generateRefreshToken(userObject);

  const sqlRefreshTokenToDB = `
      INSERT INTO refresh_tokens (user_id, token) 
      VALUES (?, ?) 
      ON CONFLICT(user_id) 
      DO UPDATE SET token = excluded.token, created_at = CURRENT_TIMESTAMP;
      `;

  // save refresh token with id to database
  db.run(sqlRefreshTokenToDB, [userId, refreshToken], (err) => {
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

  // return a new access token to res.json
  return res.status(200).json({
    message: 'Login success',
    user: { username: userObject.username, id: userId },
    accessToken: accessToken, // attach access token to res - this goes to client memory
  });
}

module.exports = {
  checkKeys,
  generateAccessToken,
  generateRefreshToken,
  generateSessionTokens,
};
