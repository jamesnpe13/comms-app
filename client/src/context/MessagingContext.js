import { useContext, createContext, useState } from 'react';
import { handleError } from '../utils/errorhandler';
import { authApi } from '../api/axiosInstance';

const MessagingContext = createContext();

export function MessagingProvider({ children }) {
  const [userGroups, setUserGroups] = useState([]);
  const [convos, setConvos] = useState([]);

  // create group
  const createGroup = async () => {
    const name = prompt('Group name');

    if (!name || name.length === 0) return;

    try {
      const res = await authApi.post('/messaging/groups', { name: name });
      getUserGroups();
    } catch (error) {}
  };

  // get user groups
  const getUserGroups = async () => {
    try {
      const res = await authApi.get('/messaging/usergroups');
      setUserGroups(res.data);
    } catch (error) {}
  };

  // create conversation
  const createConvo = async () => {
    const name = prompt('Conversation name');

    if (name === null || name.length == 0) return;

    try {
      const res = await authApi.post('/messaging/convos', { name: name });
      getConvos();
    } catch (error) {
      throw new Error(handleError(error, 'Messaging'));
    }
  };

  // get conversations
  const getConvos = async () => {
    try {
      const res = await authApi.get('/messaging/convos/created');
      const convosListReversed = res.data.convos.reverse();
      setConvos(convosListReversed);
    } catch (error) {
      throw new Error(handleError(error, 'Messaging'));
    }
  };

  // reset context state
  const resetMessagingContext = () => {
    setConvos([]);
  };

  return (
    <MessagingContext.Provider
      value={{
        convos,
        userGroups,
        getConvos,
        createConvo,
        createGroup,
        resetMessagingContext,
        getUserGroups,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}

export const useMessaging = () => useContext(MessagingContext);
