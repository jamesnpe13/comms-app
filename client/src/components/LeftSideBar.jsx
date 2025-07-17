import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import './LeftSideBar.scss';
import ConvoTile from './ConvoTile';
import NewConvo from './NewConvo';
import { useMessaging } from '../context/MessagingContext';

export default function LeftSideBar({ onLogout }) {
  const { user } = useAuth();
  const { convos, loadConvos } = useMessaging();

  useEffect(() => {
    loadConvos();
  }, []);

  return (
    <div className='left-sidebar'>
      <div className='header'>
        <div className='container'>
          <div className='profile-container'>
            <div className='profile-pic'>
              <p className='tiny'>DP</p>
            </div>
            <p className='sub profile-name'>{`${user?.first_name} ${user?.last_name}`}</p>
          </div>
          <div className='logout-button' onClick={onLogout}>
            {<LogoutIcon />}
          </div>
        </div>
      </div>

      <div className='main gutter_s'>
        {convos && convos.map((convo) => <ConvoTile data={convo} />)}
      </div>

      <div className='footer gutter_s'>
        <NewConvo />
      </div>
    </div>
  );
}
