import type { StructuredTextPart } from '@/routes/api/chat';

export type { StructuredTextPart };

export type ModelName =
	| 'anthropic/claude-haiku-4.5'
	| 'anthropic/claude-sonnet-4.5'
	| 'google/gemini-2.5-pro'
	| 'google/gemini-2.5-flash';
