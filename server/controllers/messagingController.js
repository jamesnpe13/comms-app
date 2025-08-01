const db = require('../database/connection');
const jwt = require('jsonwebtoken');
const { newError } = require('../functions');

// ========= GROUPS
// create group
exports.createGroup = async (req, res, next) => {
  const { id } = req.user;
  const { name, role = 'admin' } = req.body;

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
  const { id } = req.user;

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
  const { id } = req.params;
  const sql = `DELETE from convo_groups WHERE id = ?`;
  try {
    await db.execute(sql, [id]);

    res.json({ message: 'Group deleted' });
  } catch (err) {
    console.log(err);
  }
};

// ========= CONVOS ===========
// create convo
exports.createConvo = async (req, res, next) => {
  const { name, type = 'group', group_parent } = req.body;
  let convo_id;
  const { id } = req.user;

  const sql = `
    INSERT INTO convos (
    name,
    type,
    group_parent,
    created_by)
    VALUES (?,?,?,?)
  `;
  const createParticipantSql = `
    INSERT into participants (convo_id, user_id, role)
    VALUES (?,?,?)
  `;

  if (type !== 'private' && type !== 'group') {
    return next(newError('Convo type must be set to private or group'));
  }

  try {
    const [res] = await db.execute(sql, [name, type, group_parent, id]);
    convo_id = res.insertId;
  } catch (err) {
    next(err);
  }

  try {
    const res = await db.execute(createParticipantSql, [convo_id, id, 'admin']);
  } catch (error) {
    console.log(error);
  }
  res.json({ message: 'Convo created' });
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

exports.getUserConvos = async (req, res, next) => {
  const { id } = req.user;
  const sql = `
    SELECT
    convos.id AS convo_id,
    convos.name AS convo_name,
    convos.type AS convo_type,
    convos.group_parent AS group_parent_id,
    convo_groups.name AS group_parent_name,
    convos.created_by AS created_by_id,
    convos.created_at AS created_at,
    users.username AS participant_username,
    users.id AS participant_id,
    participants.role AS participant_role
    FROM convos
    JOIN participants ON participants.convo_id = convos.id
    JOIN users ON participants.user_id = users.id
    JOIN convo_groups ON convos.group_parent = convo_groups.id
    WHERE users.id = ?
  `;

  try {
    const [convos] = await db.execute(sql, [id]);
    res.json({ convos: convos });
  } catch (error) {
    next(error);
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
  const { id } = req.params;
  const sql = `DELETE from convos WHERE id = ?`;
  try {
    await db.execute(sql, [id]);
    res.json({ message: 'convo deleted' });
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
    const [result1] = await db.execute(getIdSql, [username]);
    const { id } = result1[0];
    const result2 = await db.execute(addMemberSql, [
      id,
      group_parent,
      'member',
    ]);
    res.json({ message: 'Created member' });
  } catch (err) {
    next(err);
  }
};

exports.getMembers = async (req, res, next) => {
  const { id } = req.body;
  const sql = `
  SELECT 
  members.*,
  users.username,
  users.first_name,
  users.last_name  
  FROM members  
  JOIN users ON users.id = members.user_id
  WHERE group_parent = ?
  `;

  try {
    const [members] = await db.execute(sql, [id]);
    res.json({ members: members });
  } catch (error) {
    console.log(error);
  }
};

// delete member
exports.deleteMember = async (req, res, next) => {
  try {
    const { user_id, group_id } = req.params;
    const sql = `
      DELETE FROM members 
      WHERE user_id = ? AND group_parent = ?;    
    `;

    await db.execute(sql, [user_id, group_id]);
    res.json({ message: 'Member deleted' });
  } catch (err) {
    next(err);
  }
};

// ========= PARTICIPANTS =========== (convo participants)
// create participant
exports.createParticipant = async (req, res, next) => {
  const { convo_id, username } = req.body;
  let user_id;
  const getUserIdSql = `SELECT id FROM users WHERE username = ?`;
  const createParticipantSql = `
    INSERT into participants (convo_id, user_id, role)
    VALUES (?,?,?)
  `;

  try {
    const [response1] = await db.execute(getUserIdSql, [username]);
    user_id = response1[0]?.id;
  } catch (err) {
    next(err);
  }

  try {
    const response2 = await db.execute(createParticipantSql, [
      convo_id,
      user_id,
      'member',
    ]);
    res.json({ message: 'Participant created' });
  } catch (error) {
    res.json({ error: error });
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
  const { id: sender_id } = req.user;
  const { convo_id, message_content } = req.body;
  const sql = `
    INSERT INTO messages (sender_id, convo_id, message_content) 
    VALUES (?, ?, ?)
  `;

  try {
    const result = await db.execute(sql, [
      sender_id,
      convo_id,
      message_content,
    ]);
    res.json({ message: 'Message created' });
  } catch (err) {
    console.log('Connot create Message');
    next(err);
  }
};

// get Messages
exports.getMessages = async (req, res, next) => {
  const { id: convo_id } = req.params;
  // const sql = `
  //   SELECT * FROM messages WHERE convo_id = ?
  // `;

  const sql = `
    SELECT 
    messages.*,
    users.first_name,
    users.last_name,
    users.email,
    users.username,
    convos.name

    FROM messages

    JOIN users ON users.id = sender_id
    JOIN convos ON convos.id = convo_id
    
    WHERE convo_id = ?

    ORDER BY messages.created_at ASC
  `;

  try {
    const [result] = await db.execute(sql, [convo_id]);
    res.json({ messages: result });
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
  const { id } = req.params;
  const sql = `
    DELETE FROM messages WHERE id = ?
  `;
  try {
    const result = db.execute(sql, [id]);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    next(err);
  }
};
