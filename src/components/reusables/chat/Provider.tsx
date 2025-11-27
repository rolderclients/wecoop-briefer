import { useChat as useSdkChat } from '@ai-sdk/react';
import { notifications } from '@mantine/notifications';
import type { ChatStatus } from 'ai';
import { createContext, useContext, useState } from 'react';
import type { AgentUIMessage, ModelName } from '@/api';
import type { ChatProps } from './types';

type SendMessage = (params: {
	text: string;
	model: ModelName;
	prompt?: string;
}) => Promise<void>;

type SetMessages = (messages: AgentUIMessage[]) => void;

interface ChatContext {
	model: ModelName;
	setModel: (model: ModelName) => void;
	prompt?: string;
	setPrompt: (prompt: string | undefined) => void;
	messages: AgentUIMessage[];
	hasMessages: boolean;
	sendMessage: SendMessage;
	setMessages: SetMessages;
	chatStatus: ChatStatus;
	error?: Error;
}

const ChatContext = createContext<ChatContext | null>(null);

export const Provider = ({
	children,
	initialModel,
	initialPrompt,
}: ChatProps) => {
	const [model, setModel] = useState<ModelName>(initialModel);
	const [prompt, setPrompt] = useState<string | undefined>(initialPrompt);

	const { messages, sendMessage, setMessages, status, error } =
		useSdkChat<AgentUIMessage>({
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
		model,
		setModel,
		prompt,
		setPrompt,
		messages: messages.filter((message) => message.role !== 'system'),
		hasMessages: messages.length > 0,
		sendMessage: async (data) => {
			const { text, ...body } = data;
			await sendMessage({ text }, { body });
		},
		setMessages,
		chatStatus: status,
		error,
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
