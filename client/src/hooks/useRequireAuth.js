import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function useRequireAuth() {
  const { requireAuth } = useAuth();

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);
}
