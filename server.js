require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./auth');
const userRoutes = require('./users');
const { db } = require('./db');

app.use(cors());

// middleware
const checkApiKey = require('./middleware/checkApiKey');

const port = process.env.SERVER_PORT || process.env.PORT;

app.use(express.json());

// app.use(checkApiKey);
app.use('/auth', checkApiKey, authRoutes);
app.use('/users', userRoutes);

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Main_server running on port ${port}`);
});
