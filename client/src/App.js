import './styles/main.scss';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Registration from './pages/Registration';
import NotFound from './pages/NotFound';

function App() {
  const { restoreSession } = useAuth();
  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <Routes>
      {/* catch all */}
      <Route path='*' element={<NotFound />} />

      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Registration />} />
      <Route path='/' element={<Dashboard />} />
    </Routes>
  );
}

export default App;
