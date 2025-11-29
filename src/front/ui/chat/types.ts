import type { AgentUIMessage } from '@/back';
import type { Model } from '@/types';

export interface ChatProps {
	children: React.ReactNode;
	chatId: string;
	initialModel?: Model;
	initialPrompt?: string;
	initialMessages?: AgentUIMessage[];
	initialDisabled?: boolean;
}
