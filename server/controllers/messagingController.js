const db = require('../database/connection');
const jwt = require('jsonwebtoken');
const { newError } = require('../functions');

// ========= GROUPS
// create group
exports.createGroup = async (req, res, next) => {
  const cookieRefreshToken = req.cookies.refreshToken;
  const { name, role = 'admin' } = req.body;
  const { id } = jwt.verify(
    cookieRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const sql = `
  INSERT INTO convo_groups (name, created_by)
  VALUES (?, ?)
  `;

  if (!name) return next(newError('Please provide a group name'));
  const connection = await db.getConnection(); // Assuming you use a pool
  try {
    await connection.beginTransaction();

    // Step 1: Insert into convo_groups
    const [groupResult] = await connection.execute(sql, [name, id]);

    const groupId = groupResult.insertId;
    console.log(groupResult);

    // Step 2: Insert into members (add creator as a member)
    await connection.execute(
      `
      INSERT INTO members (user_id, group_parent, role)
      VALUES (?, ?, ?)
    `,
      [id, groupId, role]
    );

    await connection.commit();

    res.status(201).json({ message: 'Group created', groupId });
  } catch (err) {
    await connection.rollback();
    console.error('Error creating group:', err);
    res.status(500).json({ error: 'Failed to create group' });
  } finally {
    connection.release();
  }
};

exports.getUserGroups = async (req, res, next) => {
  const cookieRefreshToken = req.cookies.refreshToken;
  const { id } = jwt.verify(
    cookieRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  // get all groups where user is a member
  const sqlUserGroups = `
    SELECT 
	  convo_groups.id AS id,
	  convo_groups.name AS group_name,     
    member.username AS member_username,
    creator.username AS group_creator,
    members.role AS role
    FROM convo_groups
    JOIN members ON members.group_parent = convo_groups.id
    JOIN users AS member ON member.id = members.user_id
    JOIN users AS creator ON creator.id = convo_groups.created_by
    WHERE member.id = ?;
  `;

  try {
    const [groups] = await db.execute(sqlUserGroups, [id]);
    res.json(groups);
  } catch (err) {
    res.json(err);
  }
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
  const { name, type = 'group', group_parent } = req.body;
  const { id } = jwt.verify(
    cookieRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const sql = `
    INSERT INTO convos (
    name,
    type,
    group_parent,
    created_by)
    VALUES (?,?,?,?)
  `;

  if (type !== 'private' && type !== 'group') {
    return next(newError('Convo type must be set to private or group'));
  }

  try {
    await db.execute(sql, [name, type, group_parent, id]);
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

// ========= MEMBERS =========== (group members)
// create member
exports.createMember = async (req, res, next) => {
  const { username, group_parent } = req.body;
  const getIdSql = `
    SELECT id FROM users
    WHERE username = ?
  `;
  const addMemberSql = `
    INSERT INTO members (user_id, group_parent, role)
    VALUES (?, ?, ?)
  `;
  try {
    const [result] = await db.execute(getIdSql, [username]);
    const { id } = result[0];
    const res = await db.execute(addMemberSql, [id, group_parent, 'member']);
  } catch (err) {
    next(err);
  }
};

exports.getMembers = async (req, res, next) => {
  const { id } = req.body;
  const sql = `
    SELECT * FROM members
    WHERE group_parent = ?
  `;

  try {
    const [members] = await db.execute(sql, [id]);
    // res.json({ members: res });
    res.json({ members: members });
  } catch (error) {
    console.log(error);
  }
};

// delete member
exports.deleteMember = async (req, res, next) => {
  try {
    res.json({ message: 'Delete member' });
  } catch (err) {
    next(err);
  }
};

// ========= PARTICIPANTS =========== (convo participants)
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
