import { io } from 'socket.io-client';

// const apiBaseUrl = 'http://localhost:5000';

const socket = io('https://comms-app-api.up.railway.app', {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

export default socket;
