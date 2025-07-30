import { useEffect } from 'react';
import './ToastTile.scss';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import CancelIcon from '@mui/icons-material/Cancel';
import { useToast } from './Toast';

export default function ToastTile({ data }) {
  const { removeToast } = useToast();
  return (
    <div
      onClick={() => {
        removeToast(data.id);
      }}
      className={`toast-tile ${data.type}`}
    >
      <div className='icon'>
        {data.type === 'default' && <NotificationsIcon />}
        {data.type === 'success' && <CheckCircleIcon />}
        {data.type === 'warning' && <WarningIcon />}
        {data.type === 'destructive' && <CancelIcon />}
      </div>
      <div className='message'>
        <p>{data.message}</p>
      </div>
    </div>
  );
}
