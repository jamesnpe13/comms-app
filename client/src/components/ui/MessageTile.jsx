import React from 'react';
import './MessageTile.scss';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/dateFormater';
import DeleteIcon from '@mui/icons-material/Delete';
import { authApi } from '../../api/axiosInstance';

export default function MessageTile({ data, loadMessages }) {
  const formatedDate = formatDate(data.created_at);
  const { user } = useAuth();

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
            onClick={deleteMessage}
          >
            <DeleteIcon />
          </button>
        )}
      </div>
    </div>
  );
}
