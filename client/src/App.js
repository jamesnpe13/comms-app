import './styles/main.scss';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import ROUTES from './routeConfig';

function App() {
  const { restoreSession } = useAuth();
  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <Routes>
      <Route path={ROUTES.dashboard.path} element={ROUTES.dashboard.element} />
      <Route path={ROUTES.catchAll.path} element={ROUTES.catchAll.element} />
      <Route path={ROUTES.register.path} element={ROUTES.register.element} />
      <Route path={ROUTES.login.path} element={ROUTES.login.element} />
    </Routes>
  );
}

export default App;
