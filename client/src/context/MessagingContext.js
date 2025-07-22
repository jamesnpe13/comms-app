import { useContext, createContext, useState } from 'react';
import { handleError } from '../utils/errorhandler';
import { authApi } from '../api/axiosInstance';
import { storeLocalStorage } from '../utils/browserStorage';

const MessagingContext = createContext();

export function MessagingProvider({ children }) {
  const [userGroups, setUserGroups] = useState([]);
  const [convos, setConvos] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);

  // hande set active group
  const handleSetActiveGroup = (group) => {
    setActiveGroup(group);
  };

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
    const type = 'group';
    const groupParent = activeGroup?.id;

    if (name === null || name.length == 0) return;

    try {
      const res = await authApi.post('/messaging/convos', {
        name: name,
        type: type,
        group_parent: groupParent,
      });
      getConvos();
    } catch (error) {
      throw new Error(handleError(error, 'Messaging'));
    }
  };

  // get conversations
  const getConvos = async () => {
    try {
      const res = await authApi.get('/messaging/convos');
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
        activeGroup,
        getConvos,
        createConvo,
        createGroup,
        resetMessagingContext,
        getUserGroups,
        handleSetActiveGroup,
        setActiveGroup,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}

export const useMessaging = () => useContext(MessagingContext);
