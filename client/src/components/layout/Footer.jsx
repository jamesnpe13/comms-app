import React from 'react';
import './Footer.scss';
import pkg from '../../../package.json';
export const APP_VERSION = pkg.version;

export default function Footer() {
  return (
    <div className='footer'>
      <p className='tiny'>CommsApp (working title) - version {APP_VERSION}</p>
    </div>
  );
}
