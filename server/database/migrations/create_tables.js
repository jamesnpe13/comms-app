const db = require('../connection');

const users = `
	CREATE TABLE IF NOT EXISTS users (
		id INT AUTO_INCREMENT PRIMARY KEY,
		username VARCHAR(100) NOT NULL UNIQUE,
		password VARCHAR(255) NOT NULL,
		first_name VARCHAR(100) NOT NULL,
		last_name VARCHAR(100) NOT NULL,
		email VARCHAR(100) NOT NULL UNIQUE,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)
`;

const convos = `
	CREATE TABLE IF NOT EXISTS convos (
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		type VARCHAR(100) NOT NULL,
		created_by INT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (created_by) REFERENCES users(id)
	)
`;

const participants = `
	CREATE TABLE IF NOT EXISTS participants (
		id INT AUTO_INCREMENT PRIMARY KEY,	
		convo_id INT NOT NULL UNIQUE,
		role VARCHAR(100) NOT NULL,
		FOREIGN KEY (convo_id) REFERENCES convos(id) ON DELETE CASCADE
	)
`;

const messages = `
	CREATE TABLE IF NOT EXISTS messages (
		id INT AUTO_INCREMENT PRIMARY KEY,	
		convo_id INT NOT NULL UNIQUE,
		sender_id INT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (convo_id) REFERENCES convos(id) ON DELETE CASCADE,
		FOREIGN KEY (sender_id) REFERENCES users(id)
	)
`;

const refreshTokens = `
	CREATE TABLE IF NOT EXISTS refresh_tokens (
		id INT AUTO_INCREMENT PRIMARY KEY,
		user_id INT NOT NULL UNIQUE,
		token TEXT NOT NULL,
		session_only TINYINT(1),
		created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	)
`;

async function createTables() {
  try {
    await db.execute(users);
    await db.execute(convos);
    await db.execute(participants);
    await db.execute(messages);
    await db.execute(refreshTokens);
    // add more tables here
    console.log('Users table checked/created');
  } catch (error) {
    console.error('Migration error', error);
    throw error;
  }
}

module.exports = createTables;
