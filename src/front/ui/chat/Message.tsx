import { Loader } from '@mantine/core';
import type { AgentUIMessage } from '@/back';
import {
	Message,
	MessageContent,
	MessageResponse,
} from '@/components/ai-elements/message';
import { useChatMessage } from './useChatMessage';

export const ChatMessage = ({ message }: { message: AgentUIMessage }) => {
	const textParts = message.parts?.filter((i) => i.type === 'text');
	const lastPart = textParts?.[textParts.length - 1];

	const chatMessage = useChatMessage(lastPart);

	return (
		<Message from={message.role}>
			{chatMessage ? (
				<MessageContent className="py-3 px-4 rounded-lg group-[.is-user]:bg-default-hover group-[.is-user]:text-default-color group-[.is-assistant]:bg-primary-light group-[.is-assistant]:text-default-color">
					<MessageResponse>{chatMessage}</MessageResponse>
				</MessageContent>
			) : (
				<Loader size={28} type="dots" />
			)}
		</Message>
	);
};
