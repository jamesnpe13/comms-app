import { useContext, createContext, useState, useEffect } from 'react';
import { handleError } from '../utils/errorhandler';
import { authApi } from '../api/axiosInstance';
import { storeLocalStorage } from '../utils/browserStorage';
import { useToast } from '../components/ui/Toast';

const MessagingContext = createContext();

export function MessagingProvider({ children }) {
  const [userGroups, setUserGroups] = useState([]);
  const { newToast } = useToast();
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
      newToast('Group successfully created', 'success');
    } catch (error) {
      newToast('Failed to create group', 'destructive');
    }
  };

  // delete group
  const deleteGroup = async () => {
    try {
      await authApi.delete(`/messaging/groups/${activeGroup.id}`);
      getUserGroups();
      setActiveGroup(null);
      setActiveConvo(null);
      newToast('Group successfully deleted', 'success');
    } catch (error) {
      console.log(error);
      newToast('Failed to delete group', 'destructive');
    }
  };

  // get user groups
  const getUserGroups = async () => {
    try {
      let res1 = await authApi.get('/messaging/usergroups');

      let array = [];

      for (let group of res1.data) {
        const groupId = group.id;

        const res2 = await authApi.post('/messaging/groups/members/group', {
          id: groupId,
        });

        const { members: participants } = res2.data;

        group = { ...group, participants };

        array.push(group);
      }

      setUserGroups(array);
    } catch (error) {
      console.log(error);
    }
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
      newToast('Chat successfully created', 'success');
    } catch (error) {
      newToast('Failed to create chat', 'destructive');
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
      newToast('Chat successfully deleted', 'success');
    } catch (error) {
      console.log(error);
      newToast('Failed to delete chat', 'destructive');
    }
  };

  // get conversations
  const getConvos = async () => {
    try {
      const res = await authApi.get('/messaging/userConvos');
      setConvos([...res.data.convos].reverse());
    } catch (error) {
      throw new Error(handleError(error, 'Messaging'));
    }
  };

  // reset context state
  const resetMessagingContext = () => {
    setConvos([]);
    setActiveConvo(null);
    setActiveGroup(null);
  };

  const removeGroupMember = async (userId, groupId) => {
    try {
      const res1 = await authApi.delete(
        `/messaging/groups/members/${userId}/${groupId}`
      );
      getUserGroups();
      newToast('Member successfully removed', 'success');
    } catch (error) {
      console.log(error);
      newToast('There was a problem removing member', 'destructive');
    }
  };

  // add group members
  const addGroupMembers = async (username) => {
    const temp = activeGroup.id;
    if (!username || username.trim().length === 0) {
      newToast('Field cannot be empty', 'warning');
      return;
    }

    try {
      // Check if user is already in group
      const res1 = await authApi.post('/messaging/groups/members/group', {
        id: activeGroup.id,
      });

      const existingUsernames = res1.data.members.map((x) => x.username);
      if (existingUsernames.includes(username)) {
        newToast(
          `${username} is already a member of ${activeGroup.group_name}`,
          'warning'
        );
        return;
      }

      // Add member to group
      const res2 = await authApi.post('/messaging/groups/members', {
        username: username,
        group_parent: activeGroup.id,
      });

      getUserGroups();
      newToast('Member successfully added', 'success');
    } catch (error) {
      console.log(error);
      console.error('Error adding group member:', error);
      newToast('User not found or failed to add', 'destructive');
    }
  };

  useEffect(() => {
    const prevId = activeGroup?.id;
    const newActiveGroup = userGroups?.find((x) => x.id === prevId);
    setActiveGroup(newActiveGroup);
  }, [userGroups]);

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
        removeGroupMember,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}

export const useMessaging = () => useContext(MessagingContext);
