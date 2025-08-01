import React, { act, use, useEffect, useRef, useState } from 'react';
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
import { useModal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { authApi } from '../../api/axiosInstance';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

function LeftSideBar({ onLogout, sidebarToggle, setSidebarToggle }) {
  const { newModal, closeModal } = useModal();
  const { newToast, removeToast } = useToast();
  const usernameInput = useRef();
  const { user, isAuth } = useAuth();
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

  const handleAddMembers = () => {
    const header = 'Add group member';
    const content = (
      <input
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addGroupMembers(usernameInput.current.value);
            closeModal();
          }
        }}
        ref={usernameInput}
        type='text'
        placeholder='Enter username'
      />
    );
    const buttons = (
      <>
        <button onClick={closeModal}>Cancel</button>
        <button
          className='primary'
          onClick={() => {
            addGroupMembers(usernameInput.current.value);
            closeModal();
          }}
        >
          Add member
        </button>
      </>
    );

    newModal({ header: header, content: content, buttons: buttons });
  };

  const renderMemberAddButton = () => {
    if (activeGroup?.role === 'admin') {
      if (activeGroup) {
        return (
          <>
            <button
              className='transparent content util-button'
              onClick={handleAddMembers}
              title='Add people to this group'
            >
              <PersonAddIcon />
            </button>
            <button
              className='content destructive transparent util-button'
              onClick={handleDeleteGroup}
              title='Delete group'
            >
              <DeleteIcon />
            </button>
          </>
        );
      }
    }
  };

  const handleDeleteGroup = () => {
    const buttons = (
      <>
        <button onClick={closeModal}>Cancel</button>
        <button
          className='destructive'
          onClick={() => {
            closeModal();
            deleteGroup();
          }}
        >
          Yes, delete group
        </button>
      </>
    );
    newModal({
      content: 'Are you sure you want to delete this group?',
      buttons: buttons,
    });
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
        .map((x) => (
          <ConvoTile
            key={x.convo_id}
            data={x}
            setSidebarToggle={setSidebarToggle}
          />
        ));
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

  const handleLogoutClick = () => {
    const buttons = (
      <>
        <button onClick={closeModal}>Cancel</button>
        <button
          onClick={() => {
            closeModal();
            onLogout();
          }}
          className='primary'
        >
          Logout
        </button>
      </>
    );
    newModal({
      content: 'Are you sure you want to log out?',
      buttons: buttons,
    });
  };

  // const getMembers = async (id) => {
  //   try {
  //     const res = await authApi.post('/messaging/groups/members/group', {
  //       id: id,
  //     });

  //     setMembers(res.data.members);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className={`left-sidebar ${sidebarToggle ? 'expanded' : 'collapsed'}`}>
      <div className='header'>
        <div
          className='sidebar-button button'
          onClick={() => {
            setSidebarToggle(!sidebarToggle);
          }}
        >
          <MenuOpenIcon />
        </div>
        <div className='profile-details'>
          <p className='sub profile-name'>{`${user?.first_name} ${user?.last_name}`}</p>
          <p className='tiny profile-email italic'>{user?.email}</p>
        </div>
        <div className='profile-pic'>
          <div>
            <p className='tiny'>DP</p>
          </div>
        </div>
        <div
          className='logout-button button'
          onClick={handleLogoutClick}
          title='Log out user'
        >
          <LogoutIcon />
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
          title='Refresh list'
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

export default React.memo(LeftSideBar);
