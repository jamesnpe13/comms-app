import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Unauthenticated from './Unauthenticated';

export default function RequireAuth({ children }) {
  const { isAuth } = useAuth();

  if (!isAuth()) {
    return <Unauthenticated />;
  }

  return children;
}
