require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { authenticateToken } = require('./middleware/authenticateToken');
const { db } = require('./db');
const authRoutes = require('./auth');
const userRoutes = require('./users');

const app = express();

// middleware
app.use(cors());
app.use(cookieParser());

const port = process.env.SERVER_PORT || process.env.PORT;

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', authenticateToken, userRoutes);

console.log();

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Main_server running on port ${port}`);
});
