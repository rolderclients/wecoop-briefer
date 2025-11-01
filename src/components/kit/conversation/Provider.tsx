import type { MantineStyleProps } from '@mantine/core';
import {
  createContext,
  type ReactNode,
  useContext,
  useRef,
  useState,
} from 'react';

interface ConversationContext {
  height?: MantineStyleProps['h'];
  viewport?: React.RefObject<HTMLDivElement | null>;
  at?: 'top' | 'bottom';
  setAt?: (at: 'top' | 'bottom') => void;
}

const ConversationContext = createContext<ConversationContext | null>(null);

export const ConversationProvider = ({
  children,
  height,
}: ConversationContext & { children: ReactNode }) => {
  const viewport = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState<'top' | 'bottom'>();

  const value = {
    height,
    viewport,
    at,
    setAt,
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
