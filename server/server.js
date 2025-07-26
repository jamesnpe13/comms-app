require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes');
const db = require('./database/connection');
const runMigrations = require('./database/migrations/create_tables');
const { errorHandler } = require('./middleware/errorHandler');
const http = require('http');
const { Server } = require('socket.io');

const allowedOrigins = [process.env.CLIENT_ORIGIN];

const port = process.env.SERVER_PORT || 5000;
const app = express();

// global middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
  app.listen(port, '0.0.0.0', (err) => {
    if (err) console.log(err);
    console.log(`Main_server running on port ${port}`);
  });
}

startServer();
