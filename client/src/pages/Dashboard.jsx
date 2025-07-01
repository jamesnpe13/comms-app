import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useRequireAuth from '../hooks/useRequireAuth';

export default function Dashboard() {
  useRequireAuth();
  const { user, logout } = useAuth();

  const handleLogout = (e) => {
    logout();
  };

  return (
    <>
      <p>{user?.username}</p>
      <p>{user?.first_name}</p>
      <p>{user?.last_name}</p>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}
