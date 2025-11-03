import {
  getRadius,
  type MantineStyleProps,
  Paper,
  type PaperProps,
  Stack,
  type StackProps,
  Title,
} from '@mantine/core';
import cx from 'clsx';
import { ScrollArea } from '../scrollArea';
import classes from './conversation.module.css';

interface RootProps extends PaperProps {
  children?: React.ReactNode;
  height?: MantineStyleProps['h'];
}

const Root = ({
  height,
  children,
  className,
  radius = 'md',
  ...props
}: RootProps) => (
  <Paper
    pos="relative"
    withBorder
    radius={radius}
    className={cx(classes.root, className)}
    {...props}
  >
    <ScrollArea
      h={height}
      autoScroll
      style={{
        '--conversation-radius': getRadius(radius),
      }}
    >
      <ScrollArea.Content>{children}</ScrollArea.Content>
      <ScrollArea.ScrollButton />
    </ScrollArea>
  </Paper>
);

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

export const Conversation = Object.assign(Root, {
  EmptyState,
});
