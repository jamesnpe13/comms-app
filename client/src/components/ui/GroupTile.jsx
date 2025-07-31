import React, { useEffect, useState } from 'react';
import './GroupTile.scss';
import GroupIcon from '@mui/icons-material/Group';
import { useMessaging } from '../../context/MessagingContext';
import { authApi } from '../../api/axiosInstance';

function GroupTile({ data, handleSetActiveGroup }) {
  const { group_name } = data;

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
        <p className='tiny italic'>
          {data.participants.length}
          <GroupIcon />
        </p>
      </div>
    </div>
  );
}

export default React.memo(GroupTile);
