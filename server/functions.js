require('dotenv').config();
const jwt = require('jsonwebtoken');
const ms = require('ms');
const db = require('./database/connection');

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
function generateRefreshToken(user, isSessionOnly) {
  const options = isSessionOnly
    ? {}
    : { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN };

  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, options);
}

/*
generate session tokens (save new refresh token to db, save new refresh token to client cookie, issue new access token and send to res.json )
*/
async function issueSessionTokens(
  userId,
  userObject,
  res,
  isSessionOnly = false
) {
  const accessToken = generateAccessToken(userObject);
  const refreshToken = generateRefreshToken(userObject, isSessionOnly);
  const sessionOnlyTinyInt = isSessionOnly ? 1 : 0;

  const sqlRefreshTokenToDB = `
    INSERT INTO refresh_tokens (user_id, token, session_only)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
    token = VALUES(token),
    session_only = VALUES(session_only);
  `;

  try {
    await db.execute(sqlRefreshTokenToDB, [
      userId,
      refreshToken,
      sessionOnlyTinyInt,
    ]);
  } catch (error) {
    return res.json({ error: error });
  }

  // save refresh token to cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: isSessionOnly ? null : ms(process.env.REFRESH_TOKEN_EXPIRES_IN),
  });

  // return a new access token to res.json
  return res.status(200).json({
    message: 'Session tokens issued',
    accessToken: accessToken, // attach access token to res - this goes to client memory
  });
}

function newError(message, status = null) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function setError(err, message, status = null) {
  err.message = message;
  err.status = status;
}

function clearRefreshTokenCookie(res) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // set secure flag only in production
    sameSite: 'Strict', // adjust as needed (e.g. 'Lax' or 'None' if cross-site)
    path: '/', // ensure the path matches the cookie path when set
  });
}

module.exports = {
  checkKeys,
  generateAccessToken,
  generateRefreshToken,
  issueSessionTokens,
  newError,
  setError,
  clearRefreshTokenCookie,
};
