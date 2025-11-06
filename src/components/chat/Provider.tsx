import { useChat as useSdkChat } from '@ai-sdk/react';
import { notifications } from '@mantine/notifications';
import type { ChatStatus } from 'ai';
import { createContext, type ReactNode, useContext } from 'react';
import type { AgentUIMessage } from '@/routes/api/chat';

interface ChatContext {
	messages: AgentUIMessage[];
	hasMessages: boolean;
	sendMessage: ({ text }: { text: string }) => Promise<void>;
	status: ChatStatus;
	error?: Error;
}

const ChatContext = createContext<ChatContext | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
	const { messages, sendMessage, status, error } = useSdkChat<AgentUIMessage>({
		onError: (e) => {
			notifications.show({
				title: 'Ошибка сервера ИИ',
				message: e.message,
				color: 'red',
			});
		},
	});

	const value = {
		messages,
		hasMessages: messages.length > 0,
		sendMessage,
		status,
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
