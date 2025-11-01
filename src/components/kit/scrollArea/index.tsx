import {
  ActionIcon,
  type ActionIconProps,
  Box,
  type BoxProps,
  ScrollArea as MantinScrollArea,
} from '@mantine/core';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';
import type { ComponentProps } from 'react';
import { ScrollAreaProvider, useScrollAreaContext } from './Provider';

interface RootProps extends BoxProps {
  children?: React.ReactNode;
  autoScrollOnInitialRender?: boolean;
  autoScroll?: boolean;
  scrollAnimation?: 'smooth' | 'instant';
}
const Root = ({
  h,
  autoScrollOnInitialRender,
  autoScroll,
  scrollAnimation,
  ...props
}: RootProps) => (
  <ScrollAreaProvider
    height={h}
    autoScrollOnInitialRender={autoScrollOnInitialRender}
    autoScroll={autoScroll}
    scrollAnimation={scrollAnimation}
  >
    <Box pos="relative" {...props} />
  </ScrollAreaProvider>
);

type ContentProps = Omit<ComponentProps<typeof MantinScrollArea>, 'height'>;

const Content = ({ children, ...props }: ContentProps) => {
  const { height, scrollRef, contentRef } = useScrollAreaContext();

  return (
    <MantinScrollArea h={height} viewportRef={scrollRef} {...props}>
      <div ref={contentRef}>{children}</div>
    </MantinScrollArea>
  );
};

const ScrollButton = (props: ActionIconProps) => {
  const { hasScrollableContent, isAboveCenter, scrollToBottom, scrollToTop } =
    useScrollAreaContext();

  const handleScrollToBottom = () => scrollToBottom();
  const handleScrollToTop = () => scrollToTop();

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
  useScrollArea: useScrollAreaContext,
});
