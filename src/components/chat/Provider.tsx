import { useChat as useSdkChat } from '@ai-sdk/react';
import { notifications } from '@mantine/notifications';
import type { ChatStatus } from 'ai';
import { nanoid } from 'nanoid';
import { createContext, type ReactNode, useContext, useEffect } from 'react';
import type { ModelName } from '@/lib';
import type { AgentUIMessage } from '@/routes/api/chat';
import { useDocument } from './useDocument';

interface ChatContext {
	messages: AgentUIMessage[];
	hasMessages: boolean;
	sendMessage: ({
		text,
		model,
		prompt,
	}: {
		text: string;
		model: ModelName;
		prompt?: string;
	}) => Promise<void>;
	document: string;
	chatStatus: ChatStatus;
	error?: Error;
}

const ChatContext = createContext<ChatContext | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
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

	const document = useDocument(messages);

	// useEffect(() => {
	// 	setDocumentFromMessages(messages);
	// }, [setDocumentFromMessages, messages]);

	const value: ChatContext = {
		messages: messages.filter((message) => message.role !== 'system'),
		hasMessages: messages.length > 0,
		// sendMessage: ({ text, model, prompt }) =>
		// 	sendMessage({ text }, { body: { model, userPrompt: prompt } }),
		sendMessage: async ({ text, model, prompt }) => {
			if (documentEditedByUser) {
				setDocumentEditedByUser(false);
				setMessages([
					{
						id: nanoid(),
						role: 'system',
						parts: [
							{
								type: 'text',
								text: `Документ был изменен пользователем:
			\`\`\`html
			${document}
			\`\`\`
								`,
							},
						],
					},
					...messages,
				]);
			}
			await sendMessage({ text }, { body: { model, userPrompt: prompt } });
		},
		document,
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
