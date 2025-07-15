import React from 'react';
import './ConvoTile.scss';

export default function ConvoTile({ data }) {
  const { name, preview } = data;

  return (
    <div className='convo-tile'>
      <h6>{name}</h6>
      <p className='sub'>{preview}</p>
    </div>
  );
}
