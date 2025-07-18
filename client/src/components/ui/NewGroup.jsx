import React from 'react';
import './NewGroup.scss';
import ForumIcon from '@mui/icons-material/Forum';
import { useMessaging } from '../../context/MessagingContext';

export default function NewGroup() {
  const { createGroup } = useMessaging();

  return (
    <button
      onClick={createGroup}
      className='new-convo-btn'
      title='Start a new group'
    >
      New group
      <ForumIcon />
    </button>
  );
}
