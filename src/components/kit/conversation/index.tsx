import {
  type MantineStyleProps,
  Paper,
  type PaperProps,
  Stack,
  type StackProps,
  Title,
} from '@mantine/core';
import { useElementSize, useInViewport } from '@mantine/hooks';
import {
  type ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ScrollArea } from '../scrollArea/mantine';
import { ConversationProvider, useConversation } from './Provider';

interface RootProps extends PaperProps {
  height?: MantineStyleProps['h'];
  children?: React.ReactNode;
}

const Root = ({ height, ...props }: RootProps) => (
  <ConversationProvider height={height}>
    <Paper withBorder radius="md" {...props}></Paper>
  </ConversationProvider>
);
type ContentProps = Omit<ComponentProps<typeof ScrollArea>, 'height'>;

const Content = ({ children, ...props }: ContentProps) => {
  const { height } = useConversation();
  const { ref, height: viewportHeight } = useElementSize();
  const { ref: botoomRef, inViewport } = useInViewport();
  const [scrolling, setScrolling] = useState(false);

  const scrollToBottom = useCallback(() => {
    ref.current?.scrollTo({
      top: ref.current?.scrollHeight,
      behavior: 'smooth',
    });
  }, [ref]);

  useEffect(() => {
    if (!inViewport) {
      scrollToBottom();
      console.log('scrollToBottom');
    }
  }, [inViewport, scrollToBottom]);

  return (
    <ScrollArea
      h={height}
      onTopThreshold={24}
      onBottomThreshold={24}
      onTopReached={() => console.log('top')}
      onBottomReached={() => console.log('bottom')}
      {...props}
    >
      {children}
      <div ref={botoomRef} />
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

export const Conversation = Object.assign(Root, { Content, EmptyState });

// export type ConversationContentProps = ComponentProps<
//   typeof StickToBottom.Content
// >;

// export const ConversationContent = ({
//   className,
//   ...props
// }: ConversationContentProps) => (
//   <StickToBottom.Content className={cn('p-4', className)} {...props} />
// );

// export type ConversationEmptyStateProps = ComponentProps<'div'> & {
//   title?: string;
//   description?: string;
//   icon?: React.ReactNode;
// };

// export const ConversationEmptyState = ({
//   className,
//   title = 'No messages yet',
//   description = 'Start a conversation to see messages here',
//   icon,
//   children,
//   ...props
// }: ConversationEmptyStateProps) => (
//   <div
//     className={cn(
//       'flex size-full flex-col items-center justify-center gap-3 p-8 text-center',
//       className,
//     )}
//     {...props}
//   >
//     {children ?? (
//       <>
//         {icon && <div className="text-muted-foreground">{icon}</div>}
//         <div className="space-y-1">
//           <h3 className="font-medium text-sm">{title}</h3>
//           {description && (
//             <p className="text-muted-foreground text-sm">{description}</p>
//           )}
//         </div>
//       </>
//     )}
//   </div>
// );

// export type ConversationScrollButtonProps = ComponentProps<typeof Button>;

// export const ConversationScrollButton = ({
//   className,
//   ...props
// }: ConversationScrollButtonProps) => {
//   const { isAtBottom, scrollToBottom } = useStickToBottomContext();

//   const handleScrollToBottom = useCallback(() => {
//     scrollToBottom();
//   }, [scrollToBottom]);

//   return (
//     !isAtBottom && (
//       <Button
//         className={cn(
//           'absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full',
//           className,
//         )}
//         onClick={handleScrollToBottom}
//         size="icon"
//         type="button"
//         variant="outline"
//         {...props}
//       >
//         <ArrowDownIcon className="size-4" />
//       </Button>
//     )
//   );
// };
