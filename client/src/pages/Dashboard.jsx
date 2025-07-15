import './Dashboard.scss';
import RequireAuth from '../components/useRequireAuth';
import { useAuth } from '../context/AuthContext';
import ROUTES from '../routeConfig';
import LeftSideBar from '../components/LeftSideBar';
import ContentPane from '../components/ContentPane';
import Footer from '../components/Footer';

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
          <LeftSideBar onLogout={handleLogout} />
          <ContentPane />
          <Footer />
        </div>
      </div>
    </RequireAuth>
  );
}
