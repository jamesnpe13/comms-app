import { useContext, createContext, useState } from 'react';
const MessagingContext = createContext();

export function MessagingProvider({ children }) {
  const [convos, setConvos] = useState([]);
  const [currentConvo, setCurrentConvo] = useState({});

  // create message
  // delete message

  // get conversations
  // get conversation thread
  // create conversation
  // delete conversation

  return (
    <MessagingContext.Provider value={{}}>{children}</MessagingContext.Provider>
  );
}

export const useMessaging = () => useContext(MessagingContext);
