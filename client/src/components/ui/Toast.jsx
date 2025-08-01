import { createContext, useContext, useEffect, useRef, useState } from 'react';
import './ToastTile.scss';
import ToastTile from './ToastTile';

const ToastContext = createContext();

export default function ToastProvider({ children }) {
  const toastCounter = useRef(0);
  const [toastStack, setToastStack] = useState([]);
  const toastDuration = 5 * 1000;

  const toast = (message, type = 'default') => {
    return { type: type, message: message, id: ++toastCounter.current };
  };

  const newToast = (message, type) => {
    const newToast = toast(message, type);

    setToastStack((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(newToast.id);
    }, toastDuration);
  };

  const removeToast = (toastId) => {
    // remove toast from stack
    setToastStack((prev) => prev.filter((toast) => toast.id !== toastId));
  };

  return (
    <ToastContext.Provider value={{ newToast, removeToast, toastStack }}>
      <div className='toast-stack'>
        {toastStack && toastStack.map((x) => <ToastTile key={x.id} data={x} />)}
      </div>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
