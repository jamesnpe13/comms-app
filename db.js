const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(process.env.DB_PATH, (err) => {
  if (err) console.error('Failed to connect to database', err.message);
  console.log('Connected to database.');
});

const initUsersTable = `
	CREATE TABLE IF NOT EXISTS "users" (
	"id"	INTEGER,
	"username"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
)`;

const initAccessTokensTable = `
	CREATE TABLE IF NOT EXISTS access_tokens (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER NOT NULL,
	token TEXT NOT NULL
)`;

const initMessagesTable = `
	CREATE TABLE IF NOT EXISTS messages (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	sender_id INTEGER NOT NULL,
	receiver_id INTEGER NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	content TEXT NOT NULL
)`;

db.serialize(() => {
  db.run(initUsersTable);
  db.run(initAccessTokensTable);
  db.run(initMessagesTable);
});

module.exports = db;
