import React from 'react';
import './Unauthenticated.scss';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../routeConfig';
import BG from '../assets/oakywood-r0GOOPc_EBI-unsplash.jpg';

export default function Unauthenticated() {
  const navigate = useNavigate();

  return (
    <>
      <img className='bg-image' src={BG} alt='' />
      <div className='unauthenticated page'>
        <h1>Please log in</h1>
        <br />
        <p>Unable to access this page.</p>
        <br />
        <button className='primary' onClick={() => navigate(ROUTES.login.path)}>
          Log in
        </button>
      </div>
    </>
  );
}
