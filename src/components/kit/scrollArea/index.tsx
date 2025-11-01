import {
  ActionIcon,
  type ActionIconProps,
  Box,
  type BoxProps,
  ScrollArea as MantinScrollArea,
} from '@mantine/core';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';
import type { ComponentProps } from 'react';
import { ScrollAreaProvider, useScrollArea } from './Provider';
import { useStickToBottom } from './useStickToBottom';

interface RootProps extends BoxProps {
  children?: React.ReactNode;
  autoScrollOnInitialRender?: boolean;
}
const Root = ({ h, autoScrollOnInitialRender, ...props }: RootProps) => (
  <ScrollAreaProvider
    height={h}
    autoScrollOnInitialRender={autoScrollOnInitialRender}
  >
    <Box pos="relative" {...props} />
  </ScrollAreaProvider>
);

type ContentProps = Omit<ComponentProps<typeof MantinScrollArea>, 'height'>;

const Content = ({ children, ...props }: ContentProps) => {
  const { height, scrollRef, contentRef } = useScrollArea();

  return (
    <MantinScrollArea h={height} viewportRef={scrollRef} {...props}>
      <div ref={contentRef}>{children}</div>
    </MantinScrollArea>
  );
};

const ScrollButton = (props: ActionIconProps) => {
  const { hasScrollableContent, isAboveCenter, scrollToBottom, scrollToTop } =
    useScrollArea();

  const handleScrollToBottom = () => scrollToBottom({ animation: 'smooth' });
  const handleScrollToTop = () => scrollToTop({ animation: 'smooth' });

  // Не показывать кнопку если нет скроллируемого контента
  if (!hasScrollableContent) {
    return null;
  }

  // Менять направление при достижении центра
  const showUpButton = !isAboveCenter;

  return (
    <ActionIcon
      pos="absolute"
      bottom={16}
      right={16}
      variant="light"
      onClick={showUpButton ? handleScrollToTop : handleScrollToBottom}
      {...props}
    >
      {showUpButton ? (
        <IconArrowUp strokeWidth={1.5} />
      ) : (
        <IconArrowDown strokeWidth={1.5} />
      )}
    </ActionIcon>
  );
};

export const ScrollArea = Object.assign(Root, {
  Content,
  ScrollButton,
  Provider: ScrollAreaProvider,
  useScrollArea,
  useStickToBottom,
});
