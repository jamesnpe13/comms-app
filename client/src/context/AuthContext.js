import { createContext, useContext, useEffect, useState } from 'react';
import { getLocalStorage, storeLocalStorage } from '../utils/browserStorage';
import { decodeToken } from '../utils/decodeToken';
import { useNavigate } from 'react-router-dom';
import useAutoRefreshToken from '../hooks/useAutoRefreshToken';
import { ApiFunctions } from '../api/requests';
import ROUTES from '../routeConfig';
import { useMessaging } from './MessagingContext';
import { useToast } from '../components/ui/Toast';
import socket from '../socket';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { resetMessagingContext } = useMessaging();
  const { newToast } = useToast();
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
    resetMessagingContext();
  };

  const login = async (data) => {
    try {
      const res = await ApiFunctions.login(data);
      const token = res.data.accessToken;
      // set access token and call login in auth
      startSession(token);
      navigate(ROUTES.dashboard.path);
      resetMessagingContext();
      newToast(`Login successful`, 'success');
    } catch (error) {
      newToast(`${error.message}`, 'destructive');
    }
  };

  useEffect(() => {
    if (user) socket.emit('register', user);
  }, [user]);

  const logout = async () => {
    // call logout in api
    try {
      const res = await ApiFunctions.logout();
      newToast(`See you back soon!`, 'success');
    } catch (error) {
      newToast('There was a problem logging out', 'Destructive');
    }
    endSession();
    navigate(ROUTES.login.path);
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
    startSession(localStorage_accessToken);
  };

  const isAuth = () => {
    const localStorage_accessToken = getLocalStorage('accessToken');
    // check valid token
    if (!isTokenValid(localStorage_accessToken)) {
      return false;
    }

    return true;
  };

  const refreshToken = async () => {
    console.log('Refreshing token');
    try {
      const res = await ApiFunctions.refreshToken();
      startSession(res.data.accessToken);
    } catch (error) {
      newToast(error.message);
      endSession();
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
        login,
        isAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
