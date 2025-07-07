import './styles/main.scss';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const { restoreSession } = useAuth();
  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/' element={<Dashboard />} />
    </Routes>
  );
}

export default App;
