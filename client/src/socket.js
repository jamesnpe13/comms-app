import { io } from 'socket.io-client';

// const apiBaseUrl = 'http://localhost:5000';
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const socket = io(apiBaseUrl, {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

export default socket;
