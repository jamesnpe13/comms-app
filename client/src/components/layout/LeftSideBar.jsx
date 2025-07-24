import React, { act, useEffect, useState } from 'react';
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
import ListEmpty from '../ui/ListEmpty';
import GroupSidebarUtil from '../ui/GroupSidebarUtil';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import CachedIcon from '@mui/icons-material/Cached';

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
    addGroupMembers,
    deleteGroup,
  } = useMessaging();

  useEffect(() => {
    getUserGroups();
    getConvos();
  }, []);

  const handleRefreshGroups = () => {
    if (!activeGroup) {
      console.log('refreshing groups');
      getUserGroups();
      return;
    }

    console.log('refreshing convos');
    getConvos();
    getUserGroups();
  };

  const renderMemberAddButton = () => {
    if (activeGroup?.role === 'admin') {
      if (activeGroup) {
        return (
          <>
            <button
              className='transparent content util-button'
              onClick={addGroupMembers}
              title='Add people to this group'
            >
              <PersonAddIcon />
            </button>
            <button
              className='content destructive transparent util-button'
              onClick={deleteGroup}
              title='Delete group'
            >
              <DeleteIcon />
            </button>
          </>
        );
      }
    }
  };

  const renderList = () => {
    if (!activeGroup) {
      if (userGroups.length > 0) {
        return userGroups.map((x) => (
          <GroupTile
            key={x.id}
            data={x}
            handleSetActiveGroup={handleSetActiveGroup}
          />
        ));
      } else {
        return <ListEmpty message='No groups available. Create a new group.' />;
      }
    }
    if (convos.length > 0) {
      return convos
        .filter((x) => x.group_parent_id === activeGroup.id)
        .map((x) => <ConvoTile key={x.convo_id} data={x} />);
    } else {
      return <ListEmpty message='No chats available. Create a new chat.' />;
    }
  };

  const renderNewButtons = () => {
    if (!activeGroup) {
      return <NewGroup />;
    }

    return <NewConvo />;
  };

  const renderSearchbar = () => {
    if (activeGroup) {
      return (
        <form className='search-container' autoComplete='off'>
          <input
            type='text'
            placeholder='Search conversation'
            title='Search for a conversation'
            name='conversation-search-input'
          />
          <button className='primary'>{<SearchIcon />}</button>
        </form>
      );
    }
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
            <LogoutIcon />
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
        {activeGroup && (
          <div className='back-button' onClick={backToGroups}>
            <ArrowBackIosIcon />
          </div>
        )}

        <div className='location'>
          {activeGroup && <p className='sub'>{activeGroup?.group_name}</p>}
          {activeGroup && <p className='tiny italic'>{activeGroup?.role}</p>}
        </div>

        {renderMemberAddButton()}
        <button
          className='refresh-groups-button transparent content util-button'
          onClick={handleRefreshGroups}
          title='Add people to this group'
        >
          <CachedIcon />
        </button>
      </div>

      {/* {renderSearchbar()} */}

      <div className='main gutter_s'>{renderList()}</div>

      <div className='footer gutter_s'>{renderNewButtons()}</div>
    </div>
  );
}
