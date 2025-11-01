import type { MantineStyleProps } from '@mantine/core';
import type { RefCallback, RefObject } from 'react';
import { createContext, type ReactNode, useContext } from 'react';
import {
  type ScrollToBottom,
  type ScrollToTop,
  useStickToBottom,
} from './useStickToBottom';

interface ScrollAreaContext {
  height?: MantineStyleProps['h'];
  scrollRef: RefObject<HTMLElement | null> & RefCallback<HTMLElement>;
  contentRef: RefObject<HTMLElement | null> & RefCallback<HTMLElement>;
  scrollToBottom: ScrollToBottom;
  scrollToTop: ScrollToTop;
  hasScrollableContent: boolean;
  isNearBottom: boolean;
  isAtBottom: boolean;
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

  const value = {
    height,
    scrollRef,
    contentRef,
    scrollToBottom,
    scrollToTop,
    hasScrollableContent,
    isNearBottom,
    isAtBottom,
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
