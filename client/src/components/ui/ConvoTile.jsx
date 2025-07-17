import React from 'react';
import './ConvoTile.scss';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';

export default function ConvoTile({ data }) {
  const { name, type } = data;

  const typeIcon = () => {
    if (type === 'group') return <GroupIcon />;
    if (type === 'private') return <PersonIcon />;
  };
  const typeLabel = () => {
    if (type === 'group') return 'Group';
    if (type === 'private') return 'Private';
  };

  return (
    <div className='convo-tile'>
      {/* {typeIcon()} */}
      <div className='container'>
        <p className='sub'>{name}</p>
        <div className='label-container'>
          <p className='type-label tiny italic'>{typeLabel()}</p>
          <p className='tiny italic'>0/10</p>
          <GroupIcon />
        </div>
      </div>
    </div>
  );
}
