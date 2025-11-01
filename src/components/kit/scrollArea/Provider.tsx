import type Lenis from 'lenis';
import { createContext, useContext } from 'react';

export interface ScrollAreaContext {
  scrollToTop: () => void;
  scrollToBottom: () => void;
  atTop: boolean;
  atBottom: boolean;
  scrollable: boolean;
  lenis: Lenis | null;
}

export const ScrollAreaContext = createContext<ScrollAreaContext | null>(null);

export const useScrollArea = () => {
  const context = useContext(ScrollAreaContext);
  if (!context) {
    throw new Error('useScrollArea must be used within a ScrollArea');
  }
  return context;
};
