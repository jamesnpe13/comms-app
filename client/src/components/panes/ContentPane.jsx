import React, { act, use, useEffect, useRef } from 'react';
import SendIcon from '@mui/icons-material/Send';
import './ContentPane.scss';
import { useMessaging } from '../../context/MessagingContext';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { authApi } from '../../api/axiosInstance';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ContentPane() {
  const { activeConvo, activeGroup, deleteConvo, getConvos } = useMessaging();
  const currentMessage = useRef('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    currentMessage.current = document.getElementById(
      'message-input-field'
    ).value;
  };

  const handleAddParticipants = async () => {
    const group_parent_id = activeConvo.group_parent_id;
    const convo_id = activeConvo.convo_id;
    let usernames = [];

    try {
      let memberIds = [];
      const rows = await authApi.post(`/messaging/groups/members/group`, {
        id: group_parent_id,
      });

      memberIds = rows.data.members.map((x) => x.user_id);

      for (let i = 0; i < memberIds.length; i++) {
        const users = await authApi.get(`/users/id/${memberIds[i]}`);
        usernames.push(users.data.user.username);
      }

      console.log(usernames);
    } catch (error) {
      console.log(error);
    }

    const username = prompt(`${usernames}`);

    if (!usernames.includes(username)) {
      alert(
        `Cannot add ${username} as participant to this conversation as they are not a member of ${activeGroup.group_name}`
      );
      return;
    }

    try {
      const res = await authApi.post('/messaging/participants', {
        convo_id: convo_id,
        username: username,
      });
    } catch (error) {}
  };

  return (
    <div className='content-pane'>
      <div className='header'>
        {activeConvo && (
          <>
            <p>{activeConvo?.convo_name}</p>

            {activeConvo?.participant_role == 'admin' && (
              <div className='content-pane-util'>
                {/* <p className='italic role'>{activeConvo?.participant_role}</p> */}
                <button
                  title='Add group members to this chat'
                  onClick={handleAddParticipants}
                  className='content'
                >
                  Add members
                  <PersonAddIcon />
                </button>
                <button
                  onClick={deleteConvo}
                  title='Delete chat'
                  className='content destructive'
                >
                  Delete chat
                  <DeleteIcon />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className='main'></div>

      {activeConvo && (
        <form
          autoComplete='off'
          className='message-input gutter_l'
          onSubmit={handleSendMessage}
        >
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
      )}
    </div>
  );
}
