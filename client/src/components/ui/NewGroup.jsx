import React, { useRef } from 'react';
import './NewGroup.scss';
import ForumIcon from '@mui/icons-material/Forum';
import { useMessaging } from '../../context/MessagingContext';
import { useModal } from './Modal';

export default function NewGroup() {
  const { newModal, closeModal } = useModal();
  const { createGroup } = useMessaging();
  const newGroupInput = useRef();

  const handleButtonClick = () => {
    const header = 'Create new group';
    const buttons = (
      <>
        <button onClick={closeModal}>Cancel</button>
        <button
          onClick={() => {
            createGroup(newGroupInput.current.value);
            closeModal();
          }}
          className='primary'
        >
          Create group
        </button>
      </>
    );
    const content = (
      <>
        <input
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              createGroup(newGroupInput.current.value);
              closeModal();
            }
          }}
          ref={newGroupInput}
          type='text'
          placeholder='Enter group name'
        />
      </>
    );

    newModal({ header: header, content: content, buttons: buttons });
  };

  return (
    <button
      onClick={handleButtonClick}
      className='new-convo-btn primary'
      title='Start a new group'
    >
      New group
      <ForumIcon />
    </button>
  );
}
