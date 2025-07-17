import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import './LeftSideBar.scss';
import ConvoTile from '../ui/ConvoTile';
import NewConvo from '../ui/NewConvo';
import { useMessaging } from '../../context/MessagingContext';

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
          <div className='logout-button' onClick={onLogout}>
            {<LogoutIcon />}
          </div>
          <div className='profile-container'>
            <div className='profile-details'>
              <p className='sub profile-name'>{`${user?.first_name} ${user?.last_name}`}</p>
              <p className='tiny profile-email italic'>{user?.email}</p>
            </div>
            <div className='profile-pic'>
              <p className='tiny'>DP</p>
            </div>
          </div>
        </div>
      </div>

      <div className='search-container gutter_s'>
        <input type='text' placeholder='Search conversation' />
        <button className='primary'>{<SearchIcon />}</button>
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
