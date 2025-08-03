import './styles/main.scss';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import ROUTES from './routeConfig';
import Footer from './components/layout/Footer';
import socket from './socket';
const apiBaseUrl = process.env.REACT_APP_API_URL;

function App() {
  const { restoreSession } = useAuth();
  const auth = useAuth();

  // for debugging
  useEffect(() => {
    // 👇 expose to window for console access
    window.apiBaseUrl = apiBaseUrl;
    window.auth = auth;
  }, [auth]);
  //----

  useEffect(() => {
    socket.on('test', (arg1) => {
      console.log(arg1);
    });
    restoreSession();
  }, []);

  return (
    <div className='page-container'>
      <Routes>
        <Route
          path={ROUTES.rootRedirect.path}
          element={ROUTES.rootRedirect.element}
        />
        <Route
          path={ROUTES.dashboard.path}
          element={ROUTES.dashboard.element}
        />
        <Route path={ROUTES.catchAll.path} element={ROUTES.catchAll.element} />
        <Route path={ROUTES.register.path} element={ROUTES.register.element} />
        <Route path={ROUTES.login.path} element={ROUTES.login.element} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
