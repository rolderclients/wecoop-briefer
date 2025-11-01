import { Response } from '@rolder/ui-kit-react';
import type { TextUIPart } from 'ai';
import { useChatMessage } from '@/hooks';

export const ChatMessageContent = ({ part }: { part: TextUIPart }) => {
  const chatMessage = useChatMessage(part);

  return <Response>{chatMessage}</Response>;
};
