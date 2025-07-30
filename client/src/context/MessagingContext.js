import { useContext, createContext, useState, useEffect, use } from 'react';
import { handleError } from '../utils/errorhandler';
import { authApi } from '../api/axiosInstance';
import { storeLocalStorage } from '../utils/browserStorage';

const MessagingContext = createContext();

export function MessagingProvider({ children }) {
  const [userGroups, setUserGroups] = useState([]);
  const [convos, setConvos] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [activeConvo, setActiveConvo] = useState(null);

  // hande set active group
  const handleSetActiveGroup = (group) => {
    setActiveGroup(group);
  };

  // handle set active convo
  const handleSetActiveConvo = (convo) => {
    setActiveConvo(convo);
  };

  // create group
  const createGroup = async (newGroupName) => {
    const name = newGroupName;

    if (!name || name.length === 0) return;

    try {
      const res = await authApi.post('/messaging/groups', { name: name });
      getUserGroups();
    } catch (error) {}
  };

  // delete group
  const deleteGroup = async () => {
    try {
      await authApi.delete(`/messaging/groups/${activeGroup.id}`);
      getUserGroups();
      setActiveGroup(null);
      setActiveConvo(null);
    } catch (error) {
      console.log(error);
    }
  };

  // get user groups
  const getUserGroups = async () => {
    try {
      const res = await authApi.get('/messaging/usergroups');
      setUserGroups([...res.data].reverse());
    } catch (error) {}
  };

  // create conversation
  const createConvo = async (convoName) => {
    const name = convoName;
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

  // delete conversation
  const deleteConvo = async () => {
    try {
      const res = await authApi.delete(
        `/messaging/convos/${activeConvo.convo_id}`
      );
      getConvos();
      setActiveConvo(null);
    } catch (error) {
      console.log(error);
    }
  };

  // get conversations
  const getConvos = async () => {
    try {
      const res = await authApi.get('/messaging/userConvos');
      setConvos([...res.data.convos].reverse());
      console.log('convos set');
    } catch (error) {
      throw new Error(handleError(error, 'Messaging'));
    }
  };

  // reset context state
  const resetMessagingContext = () => {
    setConvos([]);
  };

  // add group members
  const addGroupMembers = async (username) => {
    if (!username || username.length === 0) {
      alert('Field cannot be empty');
      return;
    }
    console.log(`>>> ${username}`);

    try {
      const res = await authApi.post('/messaging/groups/members/group', {
        id: activeGroup.id,
      });
      console.log(res.data.members);
      console.log(activeGroup);
      if (res.data.members.map((x) => x.username).includes(username)) {
        console.log(
          `${username} is already a member of ${activeGroup.group_name}`
        );
        alert(`${username} is already a member of ${activeGroup.group_name}`);
        return;
      }
    } catch (error) {
      console.log(error);
    }

    return;

    try {
      const res = await authApi.post('/messaging/groups/members', {
        username: username,
        group_parent: activeGroup.id,
      });
    } catch (error) {
      console.log(error);
      alert('User not found');
    }
  };

  return (
    <MessagingContext.Provider
      value={{
        convos,
        userGroups,
        activeGroup,
        activeConvo,
        getConvos,
        createConvo,
        createGroup,
        resetMessagingContext,
        getUserGroups,
        handleSetActiveGroup,
        setActiveGroup,
        setActiveConvo,
        addGroupMembers,
        handleSetActiveConvo,
        deleteConvo,
        deleteGroup,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}

export const useMessaging = () => useContext(MessagingContext);
