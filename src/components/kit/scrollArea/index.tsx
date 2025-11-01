import {
  Box,
  ScrollArea as MantineScrollArea,
  type MantineStyleProps,
} from '@mantine/core';
import cx from 'clsx';
import Lenis, { type LenisOptions } from 'lenis';
import { type PropsWithChildren, useEffect, useRef, useState } from 'react';
import { ScrollAreaContext } from './Provider';

import 'lenis/dist/lenis.css';
import classes from './scrollaArea.module.css';

export const ScrollArea = ({
  className,
  children,
  height,
  heightThreshold = 72, // Порог для определения позиции, чтобы достижение низа или верха было чуть раньше
  autoScroll = false,
  options,
}: PropsWithChildren<{
  className?: string;
  height: MantineStyleProps['h'];
  heightThreshold?: number;
  autoScroll?: boolean;
  options?: LenisOptions;
}>) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;

    lenisRef.current = new Lenis({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      autoRaf: true,
      ...options,
    });

    // Слушаем события скролла для обновления состояний
    lenisRef.current.on('scroll', ({ scroll, limit }) => {
      setAtTop(scroll <= heightThreshold);
      setAtBottom(scroll >= limit - heightThreshold);
    });

    return () => {
      lenisRef.current?.destroy();
    };
  }, [options, heightThreshold]);

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;

    const checkScrollable = () => {
      if (wrapperRef.current && contentRef.current) {
        const wrapperHeight = wrapperRef.current.clientHeight;
        const contentHeight = contentRef.current.scrollHeight;
        setScrollable(contentHeight > wrapperHeight);
      }
    };

    const handleContentChange = () => {
      checkScrollable();

      // Автоматическая прокрутка вниз при добавлении контента
      if (autoScroll && lenisRef.current) {
        // Проверяем, находится ли пользователь внизу перед автоскроллом
        const wasAtBottom = lenisRef.current.scroll >= lenisRef.current.limit;

        if (wasAtBottom) {
          // Принудительно обновляем размеры Lenis и скролим
          lenisRef.current.resize();
          requestAnimationFrame(() => {
            if (lenisRef.current) {
              lenisRef.current.scrollTo('bottom', { immediate: true });
            }
          });
        }
      }
    };

    // ResizeObserver для отслеживания изменений размеров
    const resizeObserver = new ResizeObserver(handleContentChange);

    // MutationObserver для отслеживания изменений DOM
    const mutationObserver = new MutationObserver(handleContentChange);

    resizeObserver.observe(wrapperRef.current);
    resizeObserver.observe(contentRef.current);

    mutationObserver.observe(contentRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [autoScroll]);

  // Методы для скролла
  const scrollToTop = () => {
    lenisRef.current?.scrollTo(0);
  };

  const scrollToBottom = () => {
    lenisRef.current?.scrollTo('bottom');
  };

  const contextValue: ScrollAreaContext = {
    scrollToTop,
    scrollToBottom,
    atTop,
    atBottom,
    scrollable,
    lenis: lenisRef.current,
  };

  return (
    <ScrollAreaContext.Provider value={contextValue}>
      <MantineScrollArea>
        <Box ref={wrapperRef} h={height} className={cx(className)}>
          <Box ref={contentRef}>{children}</Box>
        </Box>
      </MantineScrollArea>
    </ScrollAreaContext.Provider>
  );
};
