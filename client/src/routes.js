import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Registration from './pages/Registration';

const ROUTES = {
  login: {
    path: '/login',
    element: <Login />,
  },
  catchAll: {
    path: '*',
    element: <NotFound />,
  },
  register: {
    path: '/register',
    element: <Registration />,
  },
  dashboard: {
    path: '/dashboard',
    element: <Dashboard />,
  },
};
export default ROUTES;
