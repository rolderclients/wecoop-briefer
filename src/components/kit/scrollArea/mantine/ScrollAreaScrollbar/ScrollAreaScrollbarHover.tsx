import { forwardRef, useEffect, useState } from 'react';
import { useScrollAreaContext } from '../ScrollArea.context';
import {
  ScrollAreaScrollbarAuto,
  type ScrollAreaScrollbarAutoProps,
} from './ScrollAreaScrollbarAuto';

interface ScrollAreaScrollbarHoverProps extends ScrollAreaScrollbarAutoProps {
  forceMount?: true;
}

export const ScrollAreaScrollbarHover = forwardRef<
  HTMLDivElement,
  ScrollAreaScrollbarHoverProps
>((props, ref) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer = 0;
    if (context.scrollArea) {
      const handlePointerEnter = () => {
        window.clearTimeout(hideTimer);
        setVisible(true);
      };
      const handlePointerLeave = () => {
        hideTimer = window.setTimeout(
          () => setVisible(false),
          context.scrollHideDelay,
        );
      };
      context.scrollArea.addEventListener('pointerenter', handlePointerEnter);
      context.scrollArea.addEventListener('pointerleave', handlePointerLeave);

      return () => {
        window.clearTimeout(hideTimer);
        context.scrollArea.removeEventListener(
          'pointerenter',
          handlePointerEnter,
        );
        context.scrollArea.removeEventListener(
          'pointerleave',
          handlePointerLeave,
        );
      };
    }

    return undefined;
  }, [context.scrollArea, context.scrollHideDelay]);

  if (forceMount || visible) {
    return (
      <ScrollAreaScrollbarAuto
        data-state={visible ? 'visible' : 'hidden'}
        {...scrollbarProps}
        ref={ref}
      />
    );
  }

  return null;
});

ScrollAreaScrollbarHover.displayName = '@mantine/core/ScrollAreaScrollbarHover';
