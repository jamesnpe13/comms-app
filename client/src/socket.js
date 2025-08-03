import { io } from 'socket.io-client';

const apiBaseUrl = process.env.REACT_APP_API_URL;
const socketIoUrl = process.env.REACT_APP_SOCKET_IO_URL;

const socket = io(socketIoUrl, {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

export default socket;
