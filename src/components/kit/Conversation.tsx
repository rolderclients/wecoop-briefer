import {
  Paper,
  type PaperProps,
  Stack,
  type StackProps,
  Title,
} from '@mantine/core';

interface RootProps extends PaperProps {
  children?: React.ReactNode;
}

const Root = (props: RootProps) => (
  <Paper pos="relative" withBorder radius="md" {...props} />
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
