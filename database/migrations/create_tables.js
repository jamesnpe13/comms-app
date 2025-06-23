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

const refreshTokens = `
	CREATE TABLE IF NOT EXISTS refresh_tokens (
		id INT AUTO_INCREMENT PRIMARY KEY,
		user_id INT NOT NULL UNIQUE,
		token TEXT NOT NULL,
		created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	)
`;

async function createTables() {
  try {
    await db.execute(users);
    await db.execute(refreshTokens);
    // add more tables here
    console.log('Users table checked/created');
  } catch (error) {
    console.error('Migration error', error);
    throw error;
  }
}

module.exports = createTables;
