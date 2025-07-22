import React from 'react';
import './GroupSidebarUtil.scss';
import { useMessaging } from '../../context/MessagingContext';

export default function GroupSidebarUtil() {
  const { addGroupMembers } = useMessaging();

  return (
    <div className='group-sidebar-util gutter_s'>
      <button onClick={addGroupMembers} title='Add members to group'>
        Add group members
      </button>
    </div>
  );
}
