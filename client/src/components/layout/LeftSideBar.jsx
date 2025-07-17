import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
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
          <div
            className='logout-button'
            onClick={onLogout}
            title='Log out user'
          >
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

      <div className='title-container'>
        <div className='back-button'>
          <ArrowBackIosIcon />
        </div>

        <div className='location'>
          <h5 className=''>City Cross Link</h5>
          <p>Music Team</p>
        </div>
      </div>

      <form className='search-container'>
        <input
          type='text'
          placeholder='Search conversation'
          title='Search for a conversation'
          name='conversation-search-input'
        />
        <button className='primary'>{<SearchIcon />}</button>
      </form>

      <div className='main gutter_s'>
        {convos && convos.map((convo) => <ConvoTile data={convo} />)}
      </div>

      <div className='footer gutter_s'>
        <NewConvo />
      </div>
    </div>
  );
}
