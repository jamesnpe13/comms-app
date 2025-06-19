require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { authenticateToken } = require('./middleware/authenticateToken');

const authRoutes = require('./auth');
const userRoutes = require('./users');
const testRoutes = require('./test');

const app = express();
const port = process.env.SERVER_PORT || process.env.PORT;

// global middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// express middleware mount points
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/test', testRoutes);

// server listen
app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Main_server running on port ${port}`);
});
