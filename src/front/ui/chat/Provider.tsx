import { useChat as useSdkChat } from '@ai-sdk/react';
import { notifications } from '@mantine/notifications';
import type { ChatStatus } from 'ai';
import { createContext, useContext } from 'react';
import type { AgentUIMessage } from '@/back';
import type { Model } from '@/types';
import type { ChatProps } from './types';

type SendMessage = (text: string) => Promise<void>;
type SetMessages = (messages: AgentUIMessage[]) => void;

interface ChatContext {
	messages: AgentUIMessage[];
	hasMessages: boolean;
	sendMessage: SendMessage;
	setMessages: SetMessages;
	chatStatus: ChatStatus;
	model?: Model;
	error?: Error;
	disabled: boolean;
}

const ChatContext = createContext<ChatContext | null>(null);

export const Provider = ({
	children,
	chatId,
	initialModel,
	initialPrompt,
	initialMessages,
	initialDisabled,
}: ChatProps) => {
	const { messages, sendMessage, setMessages, status, error } =
		useSdkChat<AgentUIMessage>({
			messages: initialMessages,
			onError: (e) => {
				notifications.show({
					title: 'Ошибка сервера ИИ',
					message: e.message,
					color: 'red',
					autoClose: 5000,
				});
			},
		});

	const value: ChatContext = {
		messages: messages.filter((message) => message.role !== 'system'),
		hasMessages: messages.length > 0,
		sendMessage: async (text) => {
			await sendMessage(
				{ text },
				{ body: { chatId, model: initialModel?.name, prompt: initialPrompt } },
			);
		},
		setMessages,
		chatStatus: status,
		model: initialModel,
		error,
		disabled: initialDisabled || false,
	};

	return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error('useChat must be used within ChatProvider');
	}
	return context;
};
