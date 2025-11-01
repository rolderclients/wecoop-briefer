import type { MantineStyleProps } from '@mantine/core';
import { createContext, type ReactNode, useContext } from 'react';

interface ConversationContext {
  height?: MantineStyleProps['h'];
}

const ConversationContext = createContext<ConversationContext | null>(null);

export const ConversationProvider = ({
  children,
  height,
}: ConversationContext & { children: ReactNode }) => {
  const value = {
    height,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within ConversationProvider');
  }
  return context;
};
