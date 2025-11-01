import type { MantineStyleProps } from '@mantine/core';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useStickToBottom } from 'use-stick-to-bottom';

interface ConversationContext {
  height?: MantineStyleProps['h'];
  scrollRef?: React.RefObject<HTMLElement | null> &
    React.RefCallback<HTMLElement>;
  contentRef?: React.RefObject<HTMLElement | null> &
    React.RefCallback<HTMLElement>;
  at?: 'top' | 'bottom';
  setAt?: (at: 'top' | 'bottom') => void;
}

const ConversationContext = createContext<ConversationContext | null>(null);

export const ConversationProvider = ({
  children,
  height,
}: ConversationContext & { children: ReactNode }) => {
  // undefined - не показывать кнопку
  const [at, setAt] = useState<'top' | 'bottom'>();
  const { scrollRef, contentRef, isNearBottom } = useStickToBottom();

  // at bottom при автоскролле
  useEffect(() => {
    const scrollHeight = scrollRef.current?.clientHeight;
    const contentHeight = contentRef.current?.clientHeight;

    if (
      isNearBottom &&
      scrollHeight &&
      contentHeight &&
      scrollHeight < contentHeight
    ) {
      setAt('bottom');
    }
  }, [
    isNearBottom,
    scrollRef.current?.clientHeight,
    contentRef.current?.clientHeight,
  ]);

  const value = {
    height,
    scrollRef,
    contentRef,
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
