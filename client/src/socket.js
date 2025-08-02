import { io } from 'socket.io-client';

// const apiBaseUrl = 'http://localhost:5000';

const apiBaseUrl = 'https://comms-app-api.up.railway.app';

const socket = io(apiBaseUrl, {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

export default socket;
