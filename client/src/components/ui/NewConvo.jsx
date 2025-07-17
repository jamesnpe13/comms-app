import React from 'react';
import './NewConvo.scss';
import ForumIcon from '@mui/icons-material/Forum';
import { useMessaging } from '../../context/MessagingContext';

export default function NewConvo() {
  const { createConvo } = useMessaging();

  return (
    <div className='new-convo-tile' onClick={createConvo}>
      <div className='button-container'>
        New conversation
        <ForumIcon />
      </div>
    </div>
  );
}
