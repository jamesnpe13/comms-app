const db = require('../database/connection');
const jwt = require('jsonwebtoken');
const { newError } = require('../functions');

// ========= GROUPS
// create group
exports.createGroup = async (req, res, next) => {
  const cookieRefreshToken = req.cookies.refreshToken;
  const { name } = req.body;
  const { id } = jwt.verify(
    cookieRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const sql = `
  INSERT INTO convo_groups (name, created_by)
  VALUES (?, ?)
`;

  if (!name) return next(newError('Please provide a group name'));

  try {
    await db.execute(sql, [name, id]);
    res.json({ message: 'Group created' });
  } catch (err) {
    next(err);
  }
};

exports.getGroups = async (req, res, next) => {
  try {
  } catch (err) {}
};

exports.updateGroup = async (req, res, next) => {
  try {
  } catch (err) {}
};

exports.deleteGroup = async (req, res, next) => {
  try {
  } catch (err) {}
};

// ========= CONVOS ===========
// create convo
exports.createConvo = async (req, res, next) => {
  const cookieRefreshToken = req.cookies.refreshToken;
  const { name, type = 'group' } = req.body;
  const { id } = jwt.verify(
    cookieRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const sql = `
		INSERT INTO convos (
		name,
		type,
		created_by)
		VALUES (?,?,?)`;

  if (type !== 'private' && type !== 'group') {
    return next(newError('Convo type must be set to private or group'));
  }

  try {
    await db.execute(sql, [name, type, id]);
    res.json({ message: 'Convo created' });
  } catch (err) {
    next(err);
  }
};

// get convo
// exports.getConvosPartOf = async (req, res, next) => {
//   const cookieRefreshToken = req.cookies.refreshToken;
//   const { id } = jwt.verify(
//     cookieRefreshToken,
//     process.env.REFRESH_TOKEN_SECRET
//   );
//   const sql = `
// 	SELECT convos.*,
// 	users.id AS created_by_id,
// 	users.username AS created_by_username,
// 	users.first_name AS created_by_first_name,
// 	last_name AS created_by_last_name,
// 	email AS created_by_email FROM convos
// 	JOIN users ON convos.created_by = users.id
// 	WHERE convos.created_by = ?`;

//   try {
//     const [convos] = await db.execute(sql, [id]);
//     res.json({ convos: convos });
//   } catch (err) {
//     next(err);
//   }
// };

exports.getConvosCreated = async (req, res, next) => {
  const cookieRefreshToken = req.cookies.refreshToken;
  const { id } = jwt.verify(
    cookieRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const sql = `
	SELECT convos.*, 
	users.id AS created_by_id, 
	users.username AS created_by_username, 
	users.first_name AS created_by_first_name, 
	last_name AS created_by_last_name, 
	email AS created_by_email FROM convos
	JOIN users ON convos.created_by = users.id
	WHERE convos.created_by = ?`;

  try {
    const [convos] = await db.execute(sql, [id]);
    res.json({ convos: convos });
  } catch (err) {
    next(err);
  }
};

exports.getAllConvos = async (req, res, next) => {
  const cookieRefreshToken = req.cookies.refreshToken;
  const { id } = jwt.verify(
    cookieRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const sql = `
	SELECT convos.*, 
	users.id AS created_by_id, 
	users.username AS created_by_username, 
	users.first_name AS created_by_first_name, 
	last_name AS created_by_last_name, 
	email AS created_by_email FROM convos
	JOIN users ON convos.created_by = users.id`;

  try {
    const [convos] = await db.execute(sql, [id]);
    res.json({ convos: convos });
  } catch (err) {
    next(err);
  }
};

// update convo
exports.updateConvo = async (req, res, next) => {
  try {
    res.json({ message: 'update convo' });
  } catch (err) {
    next(err);
  }
};

// delete convo
exports.deleteConvo = async (req, res, next) => {
  try {
    res.json({ message: 'delete convo' });
  } catch (err) {
    next(err);
  }
};

// ========= PARTICIPANTS ===========
// create participant
exports.createParticipant = async (req, res, next) => {
  try {
    res.json({ message: 'create participants' });
  } catch (err) {
    next(err);
  }
};

// get participants
exports.getParticipants = async (req, res, next) => {
  try {
    res.json({ message: 'get participants' });
  } catch (err) {
    next(err);
  }
};

// delete participants
exports.deleteParticipant = async (req, res, next) => {
  try {
    res.json({ message: 'delete participants' });
  } catch (err) {
    next(err);
  }
};

// ========= MESSAGES ===========
// create Message
exports.createMessage = async (req, res, next) => {
  try {
    res.json({ message: 'create Message' });
  } catch (err) {
    next(err);
  }
};

// get Messages
exports.getMessages = async (req, res, next) => {
  try {
    res.json({ message: 'get Messages' });
  } catch (err) {
    next(err);
  }
};

// update Messages
exports.updateMessages = async (req, res, next) => {
  try {
    res.json({ message: 'update Messages' });
  } catch (err) {
    next(err);
  }
};

// delete Messages
exports.deleteMessages = async (req, res, next) => {
  try {
    res.json({ message: 'delete Messages' });
  } catch (err) {
    next(err);
  }
};
