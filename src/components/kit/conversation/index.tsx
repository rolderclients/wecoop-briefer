import {
  ActionIcon,
  type ActionIconProps,
  type MantineStyleProps,
  Paper,
  type PaperProps,
  ScrollArea,
  Stack,
  type StackProps,
  Title,
} from '@mantine/core';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';
import type { ComponentProps } from 'react';
import { ConversationProvider, useConversation } from './Provider';

interface RootProps extends PaperProps {
  height?: MantineStyleProps['h'];
  children?: React.ReactNode;
}

const Root = ({ height, ...props }: RootProps) => (
  <ConversationProvider height={height}>
    <Paper pos="relative" withBorder radius="md" {...props}></Paper>
  </ConversationProvider>
);
type ContentProps = Omit<ComponentProps<typeof ScrollArea>, 'height'>;

const Content = ({ children, ...props }: ContentProps) => {
  const { height, scrollRef, contentRef, setAt } = useConversation();

  return (
    <ScrollArea
      h={height}
      // topThreshold={24}
      // bottomThreshold={24}
      // autoScroll
      onTopReached={() => setAt?.('top')}
      onBottomReached={() => setAt?.('bottom')}
      viewportRef={scrollRef}
      {...props}
    >
      <div ref={contentRef}>{children}</div>
    </ScrollArea>
  );
};

interface EmptyStateProps extends StackProps {
  children?: React.ReactNode;
}

const EmptyState = ({ children, ...props }: EmptyStateProps) =>
  children || (
    <Stack align="center" mt="xl" {...props}>
      <Title order={4} c="dimmed">
        Нет сообщений
      </Title>
    </Stack>
  );

const ScrollButton = (props: ActionIconProps) => {
  const { scrollRef, at } = useConversation();

  const scrollToBottom = () =>
    scrollRef?.current?.scrollTo({
      top: scrollRef?.current?.scrollHeight,
      behavior: 'smooth',
    });

  const scrollToTop = () =>
    scrollRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });

  return at ? (
    <ActionIcon
      pos="absolute"
      bottom={16}
      right={16}
      variant="light"
      onClick={at === 'top' ? scrollToBottom : scrollToTop}
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

export const Conversation = Object.assign(Root, {
  Content,
  EmptyState,
  ScrollButton,
});
