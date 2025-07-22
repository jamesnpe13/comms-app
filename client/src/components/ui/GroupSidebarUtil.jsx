import React from 'react';
import './GroupSidebarUtil.scss';
import { useMessaging } from '../../context/MessagingContext';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function GroupSidebarUtil() {
  const { addGroupMembers } = useMessaging();

  return (
    <div className='group-sidebar-util gutter_s'>
      <button
        className='transparent'
        onClick={addGroupMembers}
        title='Add members to group'
      >
        <PersonAddIcon />
      </button>
    </div>
  );
}
