/* 
connection.js
use mysql2 promise-based version
create connection pool
*/

require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_PATH,
});

module.exports = pool;
