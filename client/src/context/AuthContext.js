import { createContext, useContext, useState } from 'react';
import { getLocalStorage, storeLocalStorage } from '../utils/browserStorage';
import { decodeToken } from '../utils/decodeToken';
import { useNavigate } from 'react-router-dom';
import useAutoRefreshToken from '../hooks/useAutoRefreshToken';
import axios from 'axios';
import { ApiFunctions } from '../api/requests';
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  const saveTokenToStorage = (token) => {
    // save to local storage
    storeLocalStorage('accessToken', token);
    // save to memory
    setAccessToken(token);
  };
  const saveUser = (token) => {
    // extract user and save to memory
    setUser(decodeToken(token));
  };

  const startSession = (token) => {
    saveTokenToStorage(token);
    saveUser(token);
  };

  const endSession = () => {
    // clear local storage
    if (getLocalStorage('accessToken')) {
      localStorage.removeItem('accessToken');
    }
    // clear memory
    setAccessToken(null);
    setUser(null);
  };

  const logout = async () => {
    // call logout in api
    try {
      const res = await ApiFunctions.logout();
      console.log(res.data);
    } catch (error) {}
    console.log('Session ended');
    endSession();
    navigate('/login');
  };

  const isTokenValid = (token) => {
    // check if null or empty
    if (!token || token === null) {
      console.log('No active session');
      return false;
    }

    const { exp } = decodeToken(token);
    // check if  token is expired
    if (exp > Date.now() / 1000) {
      return true;
    } else {
      console.log('Session token expired');
    }
    return false;
  };

  const restoreSession = () => {
    // check access token in local storage
    const localStorage_accessToken = getLocalStorage('accessToken');

    // check if token is valid / expired
    if (!isTokenValid(localStorage_accessToken)) {
      endSession();
      return;
    }
    // // process access token
    console.log('Session restored');
    startSession(localStorage_accessToken);
  };

  const requireAuth = () => {
    const localStorage_accessToken = getLocalStorage('accessToken');
    console.log('requiring auth');
    // check valid token
    if (!isTokenValid(localStorage_accessToken)) {
      console.log('Denied access. Please log in');
      navigate('/login');
      return;
    }
    console.log('authorized');
  };

  const refreshToken = async () => {
    console.log('Refreshing token');
    try {
      const res = await ApiFunctions.refreshToken();
      startSession(res.data.accessToken);
    } catch (error) {
      console.log(error);
    }
  };

  useAutoRefreshToken(accessToken, refreshToken);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        startSession,
        restoreSession,
        endSession,
        logout,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
