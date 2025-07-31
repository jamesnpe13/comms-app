import React, { act, use, useEffect, useRef } from 'react';
import SendIcon from '@mui/icons-material/Send';
import './ContentPane.scss';
import { useMessaging } from '../../context/MessagingContext';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { authApi } from '../../api/axiosInstance';
import DeleteIcon from '@mui/icons-material/Delete';
import { ReactComponent as Svg1 } from '../../assets/svg1.svg';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import MessageTile from '../ui/MessageTile';
import { useModal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

function ContentPane() {
  const {
    activeConvo,
    convos,
    setActiveGroup,
    setActiveConvo,
    activeGroup,
    deleteConvo,
    getConvos,
  } = useMessaging();
  const { user } = useAuth();
  const { newModal, closeModal } = useModal();
  const messageInput = useRef(null);
  const bottomRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const usernameInput = useRef();
  const { newToast } = useToast();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // prevent newline
      handleSendMessage(e);
      messageInput.current.value = ''; // clear textarea if needed
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const messageContentChached = messageInput.current.value.trim();

    // check if convo exists
    try {
      console.log('getting convos for checking');
      await getConvos();
      console.log('Checking convo id exists');
      if (!convos.filter((x) => x.convo_id === activeConvo.convo_id)) {
        throw new Error('Convo has been deleted');
      }
      console.log('convo exists');
    } catch (error) {
      alert(error);
    }

    try {
      await authApi.post('/messaging/messages', {
        convo_id: activeConvo?.convo_id,
        message_content: messageContentChached,
      });
      messageInput.current.value = '';
      loadMessages();
    } catch (error) {
      alert('There was a problem sending your message');
      setActiveGroup(null);
      setActiveConvo(null);
    }
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
    } catch (error) {
      console.log(error);
      newToast('Failed to add member', 'destructive');
    }

    const header = 'Add chat member';
    const content = (
      <input
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addParticipant();
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
            addParticipant();
            closeModal();
          }}
        >
          Add member
        </button>
      </>
    );

    newModal({ header: header, content: content, buttons: buttons });

    const addParticipant = async () => {
      const username = usernameInput.current.value;
      if (!usernames.includes(username)) {
        newToast(
          `Cannot add ${username} as member to this chat because they are not a member of ${activeGroup.group_name}`,
          'warning'
        );
        closeModal();
        return;
      }

      try {
        const res = await authApi.post('/messaging/participants', {
          convo_id: convo_id,
          username: username,
        });
        newToast('Successfully added member to chat.', 'success');
        closeModal();
      } catch (error) {
        newToast('Failed to add member', 'destructive');
        closeModal();
      }
    };
  };

  const loadMessages = async () => {
    const res = await authApi.get(
      `/messaging/messages/${activeConvo?.convo_id}`
    );
    setMessages(res.data.messages);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteConvo = () => {
    const buttons = (
      <>
        <button onClick={closeModal}>Cancel</button>
        <button
          className='destructive'
          onClick={() => {
            deleteConvo();
            closeModal();
          }}
        >
          Yes, delete chat
        </button>
      </>
    );
    const content = 'Are you sure you want to delete this chat?';
    newModal({ content: content, buttons: buttons });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadMessages();
  }, [activeConvo]);

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
                  onClick={handleDeleteConvo}
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

      <div className='main'>
        {!activeConvo && (
          <div className='no-active-messages'>
            <h4>Organized messaging platform for your team</h4>
          </div>
        )}
        {activeConvo && (
          <div className='messages-container'>
            {messages.length === 0 && (
              <p className='italic'>Send a message to start conversation.</p>
            )}
            {messages?.map((x) => (
              <MessageTile key={x.id} data={x} loadMessages={loadMessages} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {activeConvo && (
        <form
          autoComplete='off'
          className='message-input gutter_l'
          onSubmit={handleSendMessage}
        >
          <textarea
            name='message'
            placeholder='Write a message (Shift + Enter for new line)'
            id='message-input-field'
            autoComplete='off'
            onKeyDown={handleKeyDown}
            ref={messageInput}
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

export default React.memo(ContentPane);
