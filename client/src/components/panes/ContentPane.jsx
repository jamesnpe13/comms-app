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
import socket from '../../socket';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ForumIcon from '@mui/icons-material/Forum';

function ContentPane({ sidebarToggle, setSidebarToggle }) {
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
  const [sendButtonIsActive, setSendButtonIsActive] = useState(true);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      loadMessages();
    };

    const handleRefresh = (data) => {
      console.log('refershingconvo');
      loadMessages();
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('refresh_convo', handleRefresh);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('refresh_convo', handleRefresh);
    };
  }, [activeConvo]);

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
    if (!sendButtonIsActive) return;
    if (messageContentChached.length === 0) return;
    console.log('HEre');
    setSendButtonIsActive(false);
    // check if convo exists
    try {
      console.log('getting convos for checking');
      await getConvos();
      console.log('Checking convo id exists');
      if (!convos.filter((x) => x.convo_id === activeConvo.convo_id)) {
        throw new Error('Chat has been deleted');
      }
      await authApi.post('/messaging/messages', {
        convo_id: activeConvo?.convo_id,
        message_content: messageContentChached,
      });
      socket.emit('send_message', messageContentChached);
      messageInput.current.value = '';
    } catch (error) {
      newToast('There was a problem sending your message', 'destructive');
      setActiveGroup(null);
      setActiveConvo(null);
    } finally {
      setSendButtonIsActive(true);
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
          Delete chat
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
        <div
          className={`sidebar-button ${sidebarToggle ? 'active' : 'inactive'}`}
          onClick={() => {
            setSidebarToggle(!sidebarToggle);
          }}
        >
          <MenuOpenIcon />
        </div>
        {activeConvo && (
          <>
            <p>{activeConvo?.convo_name}</p>

            {activeConvo?.participant_role == 'admin' && (
              <div className='content-pane-util'>
                <p className='italic role'>{activeConvo?.participant_role}</p>
                <button
                  title='Add group members to this chat'
                  onClick={handleAddParticipants}
                  className='content'
                >
                  <span>Add members</span>
                  <PersonAddIcon />
                </button>
                <button
                  onClick={handleDeleteConvo}
                  title='Delete chat'
                  className='content destructive'
                >
                  <span>Delete chat</span>
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
            <p>Organized messaging platform for your team</p>
          </div>
        )}
        {activeConvo && (
          <div className='messages-container'>
            {messages.length === 0 && (
              <p className='italic'>Send a message to start conversation.</p>
            )}
            {messages?.map((x) => (
              <MessageTile key={x.id} data={x} />
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
            placeholder='Write a message...'
            id='message-input-field'
            autoComplete='off'
            onKeyDown={handleKeyDown}
            ref={messageInput}
          />
          <button
            type='submit'
            className={`${sendButtonIsActive ? 'primary' : ''}`}
            id='send-message-btn'
          >
            {sendButtonIsActive && (
              <>
                <span>Send message</span>
                <SendIcon />
              </>
            )}
            {!sendButtonIsActive && (
              <>
                <span>Sending...</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default React.memo(ContentPane);
