import React from 'react';
import './ListEmpty.scss';

export default function ListEmpty({ message }) {
  return (
    <div className='list-empty-message-container'>
      <p className='sub'>{message}</p>
    </div>
  );
}
