import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../routeConfig';

export default function RootRedirect() {
  const { isAuth, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(isAuth() ? ROUTES.dashboard.path : ROUTES.login.path);
  }, []);

  return <div className='page'></div>;
}
