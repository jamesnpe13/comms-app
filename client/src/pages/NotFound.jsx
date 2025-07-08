import React from 'react';
import './NotFound.scss';
import { useNavigate } from 'react-router-dom';
import RequireAuth from '../components/useRequireAuth';
import ROUTES from '../routeConfig';

export default function Unauthenticated() {
  const navigate = useNavigate();

  return (
    <RequireAuth thisRoute={ROUTES.catchAll}>
      <div className='not-found'>
        <h1>404 Page not found</h1>
        <br />
        <p>Oops! You wont find anything here.</p>
      </div>
    </RequireAuth>
  );
}
