import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import './LeftSideBar.scss';
import ConvoTile from './ConvoTile';
import { authApi } from '../api/axiosInstance';
import { handleError } from '../utils/errorhandler';

export default function LeftSideBar({ onLogout }) {
  const { user } = useAuth();
  const [convos, setConvos] = useState([]);

  const loadConvos = async () => {
    try {
      const res = await authApi.get('/messaging/convos/created');
      console.log(res);
      setConvos(res.data.convos);
    } catch (error) {
      throw new Error(handleError(error, 'Messaging'));
    }
  };

  useEffect(() => {
    loadConvos();
  }, []);

  return (
    <div className='left-sidebar'>
      <div className='header'>
        <div className='container'>
          <div className='profile-container'>
            <div className='profile-pic'>
              <h5>DP</h5>
            </div>
            <p className='profile-name'>{`${user?.first_name} ${user?.last_name}`}</p>
          </div>
          <div className='logout-button' onClick={onLogout}>
            {<LogoutIcon />}
          </div>
        </div>
      </div>

      <div className='main'>
        {convos && convos.map((convo) => <ConvoTile data={convo} />)}
      </div>
      <div className='footer'></div>
    </div>
  );
}
