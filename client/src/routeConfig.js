import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Login from './pages/Login';

// route config factory
const routeConfig = (path, element, requiresAuth = false) => {
  return { path, element, requiresAuth };
};

// set page routes, elements, and permissions/auth configs
const ROUTES = {
  register: routeConfig('/register', <Registration />, false),
  dashboard: routeConfig('/dashboard', <Dashboard />, true),
  catchAll: routeConfig('*', <NotFound />, false),
  login: routeConfig('/login', <Login />, false),
};

export default ROUTES;
