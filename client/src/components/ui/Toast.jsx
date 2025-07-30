import { createContext, useContext } from 'react';
import './Toast.scss';

const toastContext = createContext();

export default function Toast({ children }) {
  return { children };
}

export const useToast = () => useContext(toastContext);
