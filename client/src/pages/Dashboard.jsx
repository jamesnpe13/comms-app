import RequireAuth from '../components/useRequireAuth';
import { useAuth } from '../context/AuthContext';
import ROUTES from '../routeConfig';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const handleLogout = (e) => {
    logout();
  };

  return (
    <RequireAuth thisRoute={ROUTES.dashboard}>
      <h4>First name: {user?.first_name}</h4>
      <h4>Last name: {user?.last_name}</h4>
      <br />
      <p className='sub'>Username: {user?.username}</p>
      <p className='sub'>Email: {user?.email}</p>
      <br />
      <p className='tiny italic'>Account created: {user?.created_at}</p>
      <button onClick={handleLogout}>Logout</button>
    </RequireAuth>
  );
}
