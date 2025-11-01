import type { MantineStyleProps } from '@mantine/core';
import type { RefCallback, RefObject } from 'react';
import { createContext, type ReactNode, useContext } from 'react';
import { type ScrollToBottom, useStickToBottom } from './useStickToBottom';

interface ScrollAreaContext {
  height?: MantineStyleProps['h'];
  scrollRef: RefObject<HTMLElement | null> & RefCallback<HTMLElement>;
  contentRef: RefObject<HTMLElement | null> & RefCallback<HTMLElement>;
  scrollToBottom: ScrollToBottom;
  scrollToTop: ScrollToBottom;
  hasScrollableContent: boolean;
  isNearBottom: boolean;
  isAtBottom: boolean;
  isNearTop: boolean;
  isAboveCenter: boolean;
  escapedFromLock: boolean;
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
    isNearTop,
    isAboveCenter,
    escapedFromLock,
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
    isNearTop,
    isAboveCenter,
    escapedFromLock,
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
