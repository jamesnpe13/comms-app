import React, { useRef } from 'react';
import './NewConvo.scss';
import ForumIcon from '@mui/icons-material/Forum';
import { useMessaging } from '../../context/MessagingContext';
import { useModal } from './Modal';

export default function NewConvo() {
  const { createConvo } = useMessaging();
  const { newModal, closeModal } = useModal();
  const newConvoInput = useRef();

  const handleButtonClick = () => {
    const header = 'Create new chat';
    const buttons = (
      <>
        <button onClick={closeModal}>Cancel</button>
        <button
          onClick={() => {
            createConvo(newConvoInput.current.value);
            closeModal();
          }}
          className='primary'
        >
          Create chat
        </button>
      </>
    );
    const content = (
      <>
        <input
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              createConvo(newConvoInput.current.value);
              closeModal();
            }
          }}
          ref={newConvoInput}
          type='text'
          placeholder='Enter chat name'
        />
      </>
    );

    newModal({ header: header, content: content, buttons: buttons });
  };

  return (
    <button
      onClick={handleButtonClick}
      className='primary new-convo-btn'
      title='Start a new chat'
    >
      New chat
      <ForumIcon />
    </button>
  );
}
