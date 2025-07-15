import React, { useEffect, useRef } from 'react';
import SendIcon from '@mui/icons-material/Send';
import './ContentPane.scss';

export default function ContentPane() {
  const currentMessage = useRef('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    currentMessage.current = document.getElementById(
      'message-input-field'
    ).value;

    console.log(currentMessage.current);
  };
  return (
    <div className='content'>
      <div className='header'></div>
      <div className='main'></div>
      <form className='message-input gutter_l' onSubmit={handleSendMessage}>
        <textarea
          name='message'
          placeholder='Write a message...'
          id='message-input-field'
        />
        <button type='submit' className='primary' id='send-message-btn'>
          Send message
          {<SendIcon />}
        </button>
      </form>
    </div>
  );
}
