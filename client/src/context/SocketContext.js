import { createContext, useContext, useEffect } from 'react';
import socket from '../socket';
import { useToast } from '../components/ui/Toast';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { newToast } = useToast();

  useEffect(() => {
    const onConnectError = (err) => {
      newToast(
        'There was an error establishing a socket connection',
        'destructive'
      );
      console.error('Socket connection error:', err);
    };
    socket.on('connect_error', onConnectError);

    return () => {
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
