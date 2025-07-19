import React from 'react';
import './GroupTile.scss';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';

export default function GroupTile({ data }) {
  const { group_name } = data;

  return (
    <div className='group-tile'>
      {/* {typeIcon()} */}
      <div className='container'>
        <p className='sub'>{group_name}</p>
      </div>
    </div>
  );
}
