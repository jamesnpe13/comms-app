import './Login.scss';
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const formData = useRef({});
  const { login, user, endSession } = useAuth();

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

      <p className='tiny register-btn' onClick={() => navigate('/register')}>
        No account? Create one now.
      </p>
    </form>
  );
}
