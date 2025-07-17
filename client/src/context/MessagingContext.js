import { useContext, createContext, useState } from 'react';
import { handleError } from '../utils/errorhandler';
import { authApi } from '../api/axiosInstance';

const MessagingContext = createContext();

export function MessagingProvider({ children }) {
  const [convos, setConvos] = useState([]);
  const [currentConvo, setCurrentConvo] = useState({});

  // reset context state
  const resetMessagingContext = () => {
    setConvos([]);
    setCurrentConvo({});
  };

  // create message
  // delete message

  // create conversation
  const createConvo = async () => {
    const name = prompt('Conversation name');

    if (name === null || name.length == 0) return;

    try {
      const res = await authApi.post('/messaging/convos', { name: name });
      loadConvos();
    } catch (error) {
      throw new Error(handleError(error, 'Messaging'));
    }
  };

  // get conversations
  const loadConvos = async () => {
    try {
      const res = await authApi.get('/messaging/convos/created');
      const convosListReversed = res.data.convos.reverse();
      setConvos(convosListReversed);
    } catch (error) {
      throw new Error(handleError(error, 'Messaging'));
    }
  };
  // get conversation thread
  // delete conversation

  return (
    <MessagingContext.Provider
      value={{ convos, loadConvos, createConvo, resetMessagingContext }}
    >
      {children}
    </MessagingContext.Provider>
  );
}

export const useMessaging = () => useContext(MessagingContext);
