import RequireAuth from '../components/useRequireAuth';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const handleLogout = (e) => {
    logout();
  };

  return (
    <RequireAuth>
      <>
        <p>{user?.username}</p>
        <p>{user?.first_name}</p>
        <p>{user?.last_name}</p>
        <button onClick={handleLogout}>Logout</button>
      </>
    </RequireAuth>
  );
}
