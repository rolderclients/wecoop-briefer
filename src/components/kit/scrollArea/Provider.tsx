import type { MantineStyleProps } from '@mantine/core';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useStickToBottom } from './useStickToBottom';

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
  autoScrollOnInitialRender = false,
}: {
  children: ReactNode;
  height?: MantineStyleProps['h'];
  autoScrollOnInitialRender?: boolean;
}) => {
  // undefined - не показывать кнопку
  const [at, setAt] = useState<'top' | 'bottom'>();
  const { scrollRef, contentRef, isNearBottom, stopScroll } = useStickToBottom({
    autoScrollOnInitialRender,
  });

  // useEffect(() => {
  // stopScroll();

  // if (contentRef.caller)
  // Small timeout so stopScroll fires after auto-scroll begins
  // setTimeout(() => {
  //   // Stop scroll from useStickToBottom hook
  //   stopScroll();
  //   // Reset scroll position to top
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollTop = 0;
  //   }
  // }, 5);
  // }, [stopScroll, contentRef]);

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
