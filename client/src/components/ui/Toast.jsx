import { createContext, useContext, useEffect, useRef, useState } from 'react';
import './ToastTile.scss';
import ToastTile from './ToastTile';

const ToastContext = createContext();

export default function Toast({ children }) {
  const toastCounter = useRef(0);
  const [toastStack, setToastStack] = useState([]);
  const toastDuration = 8000;

  const toast = (message, type = 'default') => {
    return { type: type, message: message, id: ++toastCounter.current };
  };

  const newToast = (message, type) => {
    const newToast = toast(message, type);

    setToastStack([...toastStack, newToast]);

    setTimeout(() => {
      removeToast(newToast.id);
    }, toastDuration);
  };

  const removeToast = (toastId) => {
    // remove toast from stack
    setToastStack((prev) => prev.filter((toast) => toast.id !== toastId));
  };

  useEffect(() => {
    console.log(toastStack);
  }, [toastStack]);

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
