import React from 'react';
import './MessageTile.scss';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/dateFormater';
import DeleteIcon from '@mui/icons-material/Delete';
import { authApi } from '../../api/axiosInstance';
import { useModal } from './Modal';
import CircularProgress from '@mui/material/CircularProgress';
import { containerClasses } from '@mui/material/Container';

export default function MessageTile({ data, loadMessages }) {
  const formatedDate = formatDate(data.created_at);
  const { user } = useAuth();
  const { newModal, closeModal } = useModal();

  const handleDeleteMessage = () => {
    const content = 'Are you sure you want to delete this message?';
    const buttons = (
      <>
        <button onClick={closeModal}>Cancel</button>
        <button
          className='destructive'
          onClick={() => {
            deleteMessage();
            closeModal();
          }}
        >
          Yes, delete message
        </button>
      </>
    );
    newModal({ content: content, buttons: buttons });
  };

  const deleteMessage = async () => {
    try {
      const res = await authApi.delete(`/messaging/messages/${data.id}`);
      loadMessages();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className={`${
        data.sender_id === user.id ? 'sender' : 'reciever'
      } message-tile`}
      key={data.id}
    >
      <div className='details'>
        <p className='sender-name'>
          {data.first_name} {data.last_name}
        </p>
        <p className='tiny'>@{data.username}</p>
      </div>
      <pre className=''>{data.message_content}</pre>
      <div className='footer'>
        <p className='date tiny'>{formatedDate}</p>
        {data.sender_id === user.id && (
          <button
            title='Delete message'
            className='transparent content'
            onClick={handleDeleteMessage}
          >
            <DeleteIcon />
          </button>
        )}
      </div>
    </div>
  );
}
