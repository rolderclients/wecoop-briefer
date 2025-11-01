import { Message } from '@/components/kit';
import type { AgentUIMessage } from '@/routes/api/chat';
import { ChatMessageContent } from './Content';

export const ChatMessage = ({ message }: { message: AgentUIMessage }) => {
  return (
    <Message from={message.role}>
      {message.parts
        .filter((part) => part.type === 'text')
        .map((part, i) => (
          <ChatMessageContent part={part} key={`${message.id}-${i}`} />
        ))}
    </Message>
  );
};
