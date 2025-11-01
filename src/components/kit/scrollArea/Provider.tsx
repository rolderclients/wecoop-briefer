import type { MantineStyleProps } from '@mantine/core';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useStickToBottom } from 'use-stick-to-bottom';

interface ScrollAreaContext {
  height?: MantineStyleProps['h'];
  scrollRef: React.RefObject<HTMLElement | null> &
    React.RefCallback<HTMLElement>;
  contentRef: React.RefObject<HTMLElement | null> &
    React.RefCallback<HTMLElement>;
  at?: 'top' | 'bottom';
  setAt: (at: 'top' | 'bottom') => void;
}

const ScrollAreaContext = createContext<ScrollAreaContext | null>(null);

export const ScrollAreaProvider = ({
  children,
  height,
}: {
  children: ReactNode;
  height?: MantineStyleProps['h'];
}) => {
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
    <ScrollAreaContext.Provider value={value}>
      {children}
    </ScrollAreaContext.Provider>
  );
};

export const useScrollArea = () => {
  const context = useContext(ScrollAreaContext);
  if (!context) {
    throw new Error('useScrollArea must be used within ScrollAreaProvider');
  }
  return context;
};
