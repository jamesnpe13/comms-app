import { useRef } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

const NotifContext = createContext();
const toastDuration = 8; // in seconds

const toast = (message, id, type = 'default') => {
  return { id: id, type: type, message: message };
};

export function NotifProvider({ children }) {
  // toastStack
  const [toastStack, setToastStack] = useState([]);
  const toastCounter = useRef(0);

  // append to stack
  const addToast = (message, type) => {
    const id = ++toastCounter.current;
    setToastStack((prev) => [...prev, toast(message, id, type)]);

    // auto remove
    setTimeout(() => {
      setToastStack((prev) => prev.filter((t) => t.id !== id));
    }, toastDuration * 1000);
  };

  return (
    <NotifContext.Provider value={{ toastStack, addToast }}>
      {children}
    </NotifContext.Provider>
  );
}

export const useNotif = () => useContext(NotifContext);
