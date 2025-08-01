require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes');
const runMigrations = require('./database/migrations/create_tables');
const { errorHandler } = require('./middleware/errorHandler');
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

// variables
const allowedOrigins = [process.env.CLIENT_ORIGIN];
const port = process.env.SERVER_PORT || 5000;
const userSockets = new Map();
const corsConfig = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// express instance
const app = express();

// socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { corsConfig } });

// global middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsConfig));

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

// socket events
io.on('connection', (socket) => {
  console.log('socket connection established. socket_id:', socket.id);

  // user.id -> socket.id mapping
  socket.on('register', (user) => {
    userSockets.set(user.id, socket.id);
  });

  socket.on('send_message', (data) => {
    console.log('Message received:', data);

    io.emit('receive_message', data);
  });

  socket.on('delete_message', (data) => {
    console.log('Message delete:');

    io.emit('refresh_convo', data);
  });
});

function serverListen() {
  httpServer.listen(port, '0.0.0.0', (err) => {
    if (err) console.log(err);
    console.log(`Main_server running on port ${port}`);
  });
}

startServer();
