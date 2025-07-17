import React from 'react';
import './NotFound.scss';
import { useNavigate } from 'react-router-dom';
import RequireAuth from '../hooks/useRequireAuth';
import ROUTES from '../routeConfig';
import BG from '../assets/oakywood-r0GOOPc_EBI-unsplash.jpg';

export default function Unauthenticated() {
  const navigate = useNavigate();

  return (
    <RequireAuth thisRoute={ROUTES.catchAll}>
      <img className='bg-image' src={BG} alt='' />
      <div id='not-found' className='page'>
        <h1>404 Page not found</h1>
        <br />
        <p>Oops! You wont find anything here.</p>
      </div>
    </RequireAuth>
  );
}
