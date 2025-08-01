import './Dashboard.scss';
import RequireAuth from '../hooks/useRequireAuth';
import { useAuth } from '../context/AuthContext';
import ROUTES from '../routeConfig';
import LeftSideBar from '../components/layout/LeftSideBar';
import ContentPane from '../components/panes/ContentPane';
import Footer from '../components/layout/Footer';
import { useEffect, useState } from 'react';
import { containerClasses } from '@mui/material/Container';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [sidebarToggle, setSidebarToggle] = useState(false);

  const handleLogout = (e) => {
    logout();
    console.log('logging out');
  };

  useEffect(() => {
    console.log(sidebarToggle);
  }, [sidebarToggle]);

  return (
    <RequireAuth thisRoute={ROUTES.dashboard}>
      <div id='dashboard-page' className='page'>
        {/* grid container - desktop component */}
        <div className='layout-grid'>
          <LeftSideBar
            onLogout={handleLogout}
            sidebarToggle={sidebarToggle}
            setSidebarToggle={setSidebarToggle}
          />
          <ContentPane
            sidebarToggle={sidebarToggle}
            setSidebarToggle={setSidebarToggle}
          />
        </div>
      </div>
    </RequireAuth>
  );
}
