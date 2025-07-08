import React from 'react';
import './Unauthenticated.scss';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../routeConfig';

export default function Unauthenticated() {
  const navigate = useNavigate();

  return (
    <div className='unauthenticated'>
      <h1>Please log in</h1>
      <br />
      <p>Unable to access this page.</p>
      <br />
      <button onClick={() => navigate(ROUTES.login.path)}>Log in</button>
    </div>
  );
}
