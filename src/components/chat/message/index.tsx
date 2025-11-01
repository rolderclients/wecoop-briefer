import { Message } from '@/components/kit';
import type { AgentUIMessage } from '@/routes/api/chat';
import { ChatMessageContent } from './Content';

export const ChatMessage = ({ message }: { message: AgentUIMessage }) => {
  const textParts = message.parts?.filter((i) => i.type === 'text');
  const lastPart = textParts?.[textParts.length - 1];

  return (
    <Message from={message.role}>
      <ChatMessageContent part={lastPart} />
    </Message>
  );
};
