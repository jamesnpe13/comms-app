import './Dashboard.scss';
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
      <div id='dashboard-page' className='page'>
        {/* grid container - desktop component */}
        <div className='layout-grid-container'>
          <div className='left-sidebar'>
            <div className='header'>Sidebar header</div>
            <div className='main'>Sidebar main</div>
            <div className='footer'>Sidebar footer</div>
          </div>

          <div className='content'>
            <div className='header'>Content header</div>
            <div className='main'>Content main</div>
            <div className='message-input'>Content message input</div>
          </div>

          <div className='footer'>footer</div>
        </div>
      </div>
    </RequireAuth>
  );
}
