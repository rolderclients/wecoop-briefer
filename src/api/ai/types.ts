import type { InferAgentUIMessage } from 'ai';
import type { output } from 'zod/v4';
import type { createAgent, schema } from './agent';

export type StructuredTextPart = output<typeof schema>;
export type AgentUIMessage = InferAgentUIMessage<
	ReturnType<typeof createAgent>
>;

export type ModelName =
	| 'anthropic/claude-haiku-4.5'
	| 'anthropic/claude-sonnet-4.5'
	| 'google/gemini-2.5-pro'
	| 'google/gemini-2.5-flash';
