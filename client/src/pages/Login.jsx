import './Login.scss';
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../routeConfig';
import RequireAuth from '../components/useRequireAuth';
import { useNotif } from '../context/NotifContext';
import BG from '../assets/oakywood-r0GOOPc_EBI-unsplash.jpg';

export default function Login() {
  const navigate = useNavigate();
  const formData = useRef({});
  const { login, user, endSession } = useAuth();
  const { toastStack, addToast } = useNotif();

  const handleInputChange = (e) => {
    let obj;
    obj = {
      ...formData.current,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    };

    formData.current = obj;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    document.getElementById('password').value = '';
    login(formData.current);
  };

  const handleAddToast = (e) => {
    e.preventDefault();

    const messageValue = document.getElementById('toast-message').value;
    addToast(messageValue);
  };

  useEffect(() => {
    // clear session on login page load
    endSession();
  }, []);

  return (
    <RequireAuth thisRoute={ROUTES.login}>
      <img className='bg-image' src={BG} alt='' />
      <div id='login-page' className='page'>
        <form
          action='login'
          autoComplete='off'
          onSubmit={handleSubmit}
          className='gutter_l'
        >
          <h1 className='text-white weight'>CommsApp</h1>
          <p>Centralized comms platform for your team.</p>

          <h4 className='margin_block'>User Login</h4>
          <input
            type='text'
            name='username'
            placeholder='Username'
            onChange={handleInputChange}
          />
          <input
            type='password'
            name='password'
            placeholder='Password'
            id='password'
            onChange={handleInputChange}
          />
          {/* <label>
            <input
              type='checkbox'
              name='session_only'
              onChange={handleInputChange}
            />
            <span className='sub'>Session only</span>
          </label> */}
          <button className='margin_block primary' type='submit'>
            Log in
          </button>

          <span
            className='sub register-btn text-button'
            onClick={() => navigate(ROUTES.register.path)}
          >
            No account? Create one now.
          </span>
        </form>
      </div>
    </RequireAuth>
  );
}
