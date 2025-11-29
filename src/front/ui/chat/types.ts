import type { AgentUIMessage, ModelName } from '@/back';

export interface ChatProps {
	children: React.ReactNode;
	chatId: string;
	initialModel: ModelName;
	initialPrompt?: string;
	initialMessages?: AgentUIMessage[];
}
