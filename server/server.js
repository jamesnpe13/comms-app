require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes');
const db = require('./database/connection');
const runMigrations = require('./database/migrations/create_tables');
const { errorHandler } = require('./middleware/errorHandler');

const port = process.env.SERVER_PORT || process.env.PORT;
const app = express();

//note

// global middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

// express middleware mount points
app.use('/', routes);

// global error handler
app.use(errorHandler);

// server start
async function startServer() {
  try {
    console.log('running migrations');
    await runMigrations();
    serverListen();
  } catch (error) {
    console.log('Failed to start server due to migration error');
  }
}

function serverListen() {
  app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`Main_server running on port ${port}`);
  });
}

startServer();
