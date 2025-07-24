import React from 'react';
import './NewConvo.scss';
import ForumIcon from '@mui/icons-material/Forum';
import { useMessaging } from '../../context/MessagingContext';

export default function NewConvo() {
  const { createConvo } = useMessaging();

  return (
    <button
      onClick={createConvo}
      className='primary new-convo-btn'
      title='Start a new chat'
    >
      New chat
      <ForumIcon />
    </button>
  );
}
