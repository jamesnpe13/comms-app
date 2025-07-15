import React from 'react';
import { useAuth } from '../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import './LeftSideBar.scss';
import ConvoTile from './ConvoTile';

export default function LeftSideBar({ onLogout }) {
  const { user } = useAuth();

  return (
    <div className='left-sidebar'>
      <div className='header'>
        <div className='container'>
          <div className='profile-container'>
            <div className='profile-pic'>
              <h5>DP</h5>
            </div>
            <h5 className='profile-name'>{`${user?.first_name} ${user?.last_name}`}</h5>
          </div>
          <div className='logout-button' onClick={onLogout}>
            {<LogoutIcon />}
          </div>
        </div>
      </div>

      <div className='main'></div>
      <div className='footer'></div>
    </div>
  );
}
