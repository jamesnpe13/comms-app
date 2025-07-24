import React, { use, useEffect } from 'react';
import './ConvoTile.scss';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import { useMessaging } from '../../context/MessagingContext';

export default function ConvoTile({ data }) {
  const { handleSetActiveConvo } = useMessaging();
  const { convo_name, convo_type } = data;

  const typeIcon = () => {
    if (convo_type === 'group') return <GroupIcon />;
    if (convo_type === 'private') return <PersonIcon />;
  };
  const typeLabel = () => {
    if (convo_type === 'group') return 'Group';
    if (convo_type === 'private') return 'Private';
  };

  return (
    <div
      className='convo-tile'
      onClick={() => {
        handleSetActiveConvo(data);
      }}
    >
      {/* {typeIcon()} */}
      <div className='container'>
        <p className='sub'>{convo_name}</p>
        <div className='label-container'>
          <p className='type-label tiny italic'>{typeLabel()}</p>
          <p className='tiny italic'>0/10</p>
          <GroupIcon />
        </div>
      </div>
    </div>
  );
}
