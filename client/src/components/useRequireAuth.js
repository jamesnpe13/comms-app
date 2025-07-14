import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Unauthenticated from './Unauthenticated';

export default function RequireAuth({ thisRoute, children }) {
  const { isAuth } = useAuth();

  if (thisRoute.requiresAuth && !isAuth()) {
    return <Unauthenticated />;
  }

  return children;
}
