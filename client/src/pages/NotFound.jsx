import React from 'react';
import './NotFound.scss';
import { useNavigate } from 'react-router-dom';

export default function Unauthenticated() {
  const navigate = useNavigate();

  return (
    <div className='not-found'>
      <h1>404 Page not found</h1>
      <br />
      <p>Oops! You wont find anything here.</p>
    </div>
  );
}
