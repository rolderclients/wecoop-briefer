import type { InferAgentUIMessage } from 'ai';
import type { output } from 'zod/v4';
import z from 'zod/v4';
import type { createAgent, schema } from './agent';

export type StructuredTextPart = output<typeof schema>;
export type AgentUIMessage = InferAgentUIMessage<
	ReturnType<typeof createAgent>
>;

export const modelNameSchema = z.enum([
	'anthropic/claude-haiku-4.5',
	'anthropic/claude-sonnet-4.5',
	'google/gemini-2.5-pro',
	'google/gemini-2.5-flash',
]);

export type ModelName = z.infer<typeof modelNameSchema>;
