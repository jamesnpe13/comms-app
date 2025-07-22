import React, {
  useDebugValue,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import { useAuth } from '../../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import './LeftSideBar.scss';
import { useMessaging } from '../../context/MessagingContext';
import NewGroup from '../ui/NewGroup';
import NewConvo from '../ui/NewConvo';
import GroupTile from '../ui/GroupTile';
import ConvoTile from '../ui/ConvoTile';

export default function LeftSideBar({ onLogout }) {
  const { user } = useAuth();
  const {
    activeGroup,
    userGroups,
    getUserGroups,
    convos,
    getConvos,
    handleSetActiveGroup,
    setActiveGroup,
  } = useMessaging();

  useEffect(() => {
    getUserGroups();
    getConvos();
  }, []);

  const renderList = () => {
    if (!activeGroup) {
      return userGroups.map((x) => (
        <GroupTile
          key={x.id}
          data={x}
          handleSetActiveGroup={handleSetActiveGroup}
        />
      ));
    }
    return convos
      .filter((x) => x.group_parent === activeGroup.id)
      .map((x) => <ConvoTile key={x.id} data={x} />);
  };

  const backToGroups = () => {
    setActiveGroup(null);
  };

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
        <div className='back-button' onClick={backToGroups}>
          <ArrowBackIosIcon />
        </div>

        <div className='location'>
          <h5>{activeGroup ? activeGroup?.group_name : 'Groups'}</h5>
          {/* <p>{}</p> */}
        </div>
      </div>

      <form className='search-container' autoComplete='off'>
        <input
          type='text'
          placeholder='Search conversation'
          title='Search for a conversation'
          name='conversation-search-input'
        />
        <button className='primary'>{<SearchIcon />}</button>
      </form>

      <div className='main gutter_s'>{renderList()}</div>

      <div className='gutter_s'>
        <NewGroup />
      </div>

      <div className='footer gutter_s'>
        <NewConvo />
      </div>
    </div>
  );
}
