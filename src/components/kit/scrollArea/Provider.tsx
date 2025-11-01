import type { MantineStyleProps } from '@mantine/core';
import type { RefCallback, RefObject } from 'react';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  type ScrollToBottom,
  type ScrollToTop,
  useStickToBottom,
} from './useStickToBottom';

interface ScrollAreaContext {
  height?: MantineStyleProps['h'];
  scrollRef: RefObject<HTMLElement | null> & RefCallback<HTMLElement>;
  contentRef: RefObject<HTMLElement | null> & RefCallback<HTMLElement>;
  at?: 'top' | 'bottom';
  setAt: (at: 'top' | 'bottom') => void;
  scrollToBottom: ScrollToBottom;
  scrollToTop: ScrollToTop;
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
  const {
    scrollRef,
    contentRef,
    isNearBottom,
    isAtBottom,
    hasScrollableContent,
    scrollToBottom,
    scrollToTop,
  } = useStickToBottom({
    autoScrollOnInitialRender,
  });

  // Определение позиции кнопки на основе состояний хука
  useEffect(() => {
    if (!hasScrollableContent) {
      setAt(undefined);
    } else if (isNearBottom || isAtBottom) {
      setAt('bottom');
    } else {
      setAt('top');
    }
  }, [hasScrollableContent, isNearBottom, isAtBottom]);

  const value = {
    height,
    scrollRef,
    contentRef,
    at,
    setAt,
    scrollToBottom,
    scrollToTop,
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
