import { Loader } from '@mantine/core';
import { Response } from '@rolder/ui-kit-react';
import type { TextUIPart } from 'ai';
import { useChatMessage } from '@/hooks';

export const ChatMessageContent = ({ part }: { part: TextUIPart }) => {
  const chatMessage = useChatMessage(part);

  return chatMessage ? (
    <Response>{chatMessage}</Response>
  ) : (
    <Loader
      size={28}
      my={-2}
      type="dots"
      color="light-dark(var(--mantine-color-orange-8), var(--mantine-color-orange-1))"
    />
  );
};
