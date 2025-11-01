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
  const { height, scrollRef, contentRef, setAt } = useScrollArea();

  return (
    <MantinScrollArea
      h={height}
      onTopReached={() => setAt?.('top')}
      onBottomReached={() => setAt?.('bottom')}
      viewportRef={scrollRef}
      {...props}
    >
      <div ref={contentRef}>{children}</div>
    </MantinScrollArea>
  );
};

const ScrollButton = (props: ActionIconProps) => {
  const { at, scrollToBottom, scrollToTop } = useScrollArea();

  const handleScrollToBottom = () => scrollToBottom({ animation: 'smooth' });

  const handleScrollToTop = () => scrollToTop();

  return at ? (
    <ActionIcon
      pos="absolute"
      bottom={16}
      right={16}
      variant="light"
      onClick={at === 'top' ? handleScrollToBottom : handleScrollToTop}
      {...props}
    >
      {at === 'top' ? (
        <IconArrowDown strokeWidth={1.5} />
      ) : (
        <IconArrowUp strokeWidth={1.5} />
      )}
    </ActionIcon>
  ) : null;
};

export const ScrollArea = Object.assign(Root, {
  Content,
  ScrollButton,
  Provider: ScrollAreaProvider,
});
