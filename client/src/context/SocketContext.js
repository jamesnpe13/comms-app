import { createContext, useContext, useEffect } from 'react';
import socket from '../socket';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  useEffect(() => {
    const onConnect = () => {
      console.log('connected to socket. socket_id:', socket.id);
    };

    const onConnectError = (err) => {
      console.error('Socket connection error:', err);
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onConnectError);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
