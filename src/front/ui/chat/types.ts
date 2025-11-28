import type { ModelName } from '@/back';

export interface ChatProps {
	children: React.ReactNode;
	initialModel: ModelName;
	initialPrompt?: string;
}
