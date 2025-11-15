import type { ModelName } from '@/api';

export interface ChatProps {
	children: React.ReactNode;
	initialModel: ModelName;
	initialPrompt?: string;
}
