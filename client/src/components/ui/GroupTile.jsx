import React, { useEffect, useState } from 'react';
import './GroupTile.scss';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import { useMessaging } from '../../context/MessagingContext';
import { authApi } from '../../api/axiosInstance';

export default function GroupTile({ data, handleSetActiveGroup }) {
  const { group_name } = data;
  const [members, setMembers] = useState([]);

  const getMembers = async () => {
    try {
      const res = await authApi.post('/messaging/groups/members/group', {
        id: data.id,
      });

      setMembers(res.data.members);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

  return (
    <div
      className='group-tile'
      onClick={() => {
        handleSetActiveGroup(data);
      }}
    >
      {/* {typeIcon()} */}
      <div className='container'>
        <p className='sub'>{group_name}</p>
        <p className='tiny italic'>{members.length} members</p>
      </div>
    </div>
  );
}
