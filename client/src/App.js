import './styles/main.scss';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import ROUTES from './routeConfig';

function App() {
  const { restoreSession, isAuth } = useAuth();

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <div className='page-container'>
      <Routes>
        <Route
          path={ROUTES.rootRedirect.path}
          element={
            isAuth() ? ROUTES.dashboard.element : ROUTES.rootRedirect.element
          }
        />
        <Route
          path={ROUTES.dashboard.path}
          element={ROUTES.dashboard.element}
        />
        <Route path={ROUTES.catchAll.path} element={ROUTES.catchAll.element} />
        <Route path={ROUTES.register.path} element={ROUTES.register.element} />
        <Route path={ROUTES.login.path} element={ROUTES.login.element} />
      </Routes>
    </div>
  );
}

export default App;
