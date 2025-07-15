import './Registration.scss';
import { useRef } from 'react';
import { register } from '../api/requests';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../routeConfig';
import RequireAuth from '../components/useRequireAuth';
import BG from '../assets/oakywood-r0GOOPc_EBI-unsplash.jpg';

export default function Registration() {
  const navigate = useNavigate();
  const formData = useRef({});
  const password1Input = useRef(null);
  const password2Input = useRef(null);

  const handleOnInputChange = (e) => {
    formData.current = {
      ...formData.current,
      [e.target.name]: e.target.value,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    password1Input.current.value = '';
    password2Input.current.value = '';
    // check password match
    if (formData.current.password1 !== formData.current.password2) {
      console.log('Passwords do not match.');
      return;
    }
    // replace remove password1 and password2 and create password
    formData.current.password = formData.current.password1;
    delete formData.current.password1;
    delete formData.current.password2;
    // capitalize first character of first and last name
    formData.current.first_name =
      formData.current.first_name.charAt(0).toUpperCase() +
      formData.current.first_name.slice(1);
    formData.current.last_name =
      formData.current.last_name.charAt(0).toUpperCase() +
      formData.current.last_name.slice(1);
    // api request
    try {
      const res = await register(formData.current);
      console.log(res);
      alert('User created');
      navigate(ROUTES.login.path);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <RequireAuth thisRoute={ROUTES.register}>
      <img className='bg-image' src={BG} alt='' />
      <div id='registration-page' className='page gutter_l'>
        <form action='register' onSubmit={handleSubmit} className='gutter'>
          <h1 className='text-white weight'>CommsApp</h1>
          <p>Centralized comms platform for your team.</p>
          <h4 className='margin_block'>Create new user</h4>

          <div className='container'>
            <input
              required={true}
              type='text'
              name='first_name'
              placeholder='First name'
              onChange={handleOnInputChange}
            />
            <input
              required={true}
              type='text'
              name='last_name'
              placeholder='Last name'
              onChange={handleOnInputChange}
            />
          </div>
          <input
            required={true}
            type='email'
            name='email'
            placeholder='Email'
            onChange={handleOnInputChange}
            className='margin_top'
          />
          <input
            required={true}
            type='text'
            name='username'
            placeholder='Username'
            onChange={handleOnInputChange}
          />
          <input
            required={true}
            type='password'
            name='password1'
            placeholder='Password'
            ref={password1Input}
            onChange={handleOnInputChange}
            className='margin_top'
          />
          <input
            required={true}
            type='password'
            name='password2'
            placeholder='Confirm password'
            ref={password2Input}
            onChange={handleOnInputChange}
          />
          <button type='submit' className='margin_block primary'>
            Submit
          </button>

          <span
            className='text-button sub'
            id='login-btn'
            onClick={() => navigate(ROUTES.login.path)}
          >
            Return to login
          </span>
        </form>
      </div>
    </RequireAuth>
  );
}
