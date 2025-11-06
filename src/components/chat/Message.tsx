import { Loader } from '@mantine/core';
import { Message, MessageContent, Response } from '@/components';
import { useChatMessage } from '@/lib';
import type { AgentUIMessage } from '@/routes/api/chat';

export const ChatMessage = ({ message }: { message: AgentUIMessage }) => {
	const textParts = message.parts?.filter((i) => i.type === 'text');
	const lastPart = textParts?.[textParts.length - 1];

	const chatMessage = useChatMessage(lastPart);

	return (
		<Message from={message.role} className="py-2">
			{chatMessage ? (
				<MessageContent className="group-[.is-user]:bg-default-hover group-[.is-user]:text-default-color group-[.is-assistant]:bg-primary-light group-[.is-assistant]:text-default-color">
					<Response>{chatMessage}</Response>
				</MessageContent>
			) : (
				<Loader size={28} type="dots" />
			)}
		</Message>
	);
};
