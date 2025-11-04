import { useChat as useSdkChat } from '@ai-sdk/react';
import type { ChatStatus } from 'ai';
import { createContext, type ReactNode, useContext } from 'react';
import type { AgentUIMessage } from '@/routes/api/chat';

interface ChatContext {
	messages: AgentUIMessage[];
	hasMessages: boolean;
	sendMessage: ({ text }: { text: string }) => Promise<void>;
	status: ChatStatus;
}

const ChatContext = createContext<ChatContext | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
	const { messages, sendMessage, status } = useSdkChat<AgentUIMessage>();

	const value = {
		messages,
		hasMessages: messages.length > 0,
		sendMessage,
		status,
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
