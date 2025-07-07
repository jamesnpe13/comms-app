import './Login.scss';
import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ApiFunctions } from '../api/requests';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export default function Login() {
  const navigate = useNavigate();
  const formData = useRef({});
  const { startSession, user, endSession } = useAuth();

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
    console.log(formData);
    e.preventDefault();
    document.getElementById('password').value = '';
    handleRequest();
  };

  const handleRequest = async () => {
    try {
      const res = await ApiFunctions.login(formData.current);
      const token = res.data.accessToken;

      // set access token and call login in auth
      startSession(token);
      // navigate to dashboard
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // clear session on login page load
    endSession();
  }, []);

  return (
    <form action='login' onSubmit={handleSubmit}>
      <h4>User Login</h4>
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
      <label>
        <input
          type='checkbox'
          name='session_only'
          onChange={handleInputChange}
        />
        <span className='sub'>Session only</span>
      </label>
      <button type='submit'>Log in</button>

      <p className='tiny italic'>
        {user
          ? `User: ${user.first_name} ${user.last_name}`
          : 'No user logged in'}{' '}
      </p>
    </form>
  );
}
