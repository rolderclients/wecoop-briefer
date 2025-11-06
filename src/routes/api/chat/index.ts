import type { AnthropicProviderOptions } from '@ai-sdk/anthropic';
import type { GoogleGenerativeAIProviderOptions } from '@ai-sdk/google';
import type { XaiProviderOptions } from '@ai-sdk/xai';
import { createFileRoute } from '@tanstack/react-router';
import {
	createAgentUIStreamResponse,
	type InferAgentUIMessage,
	Output,
	ToolLoopAgent,
	type UIMessage,
} from 'ai';
import { object, type output, string } from 'zod/v4';
import type { ModelName } from '@/lib';

const providerOptions = {
	anthropic: {
		thinking: { type: 'disabled' },
	} satisfies AnthropicProviderOptions,
	google: {
		thinkingConfig: { includeThoughts: false },
	} satisfies GoogleGenerativeAIProviderOptions,
	xai: {
		reasoningEffort: 'low',
	} satisfies XaiProviderOptions,
};

const schema = object({
	document: string().describe(
		'Документ в формате HTML. Используй только при явной потребности.',
	),
	chat: string().describe(
		'Сообщения в чат для пользователя (Markdown). Никогжа не поясняй пользователю технических деталей формата документа (Markdown, HTML, CSS и т.д.)',
	),
});

export type StructuredTextPart = output<typeof schema>;

const createAgent = (model: ModelName = 'anthropic/claude-haiku-4.5') =>
	new ToolLoopAgent({
		model,
		providerOptions,
		instructions:
			'Создавай или изменяй документ только по просьбе пользователя',
		output: Output.object({ schema }),
	});

export type AgentUIMessage = InferAgentUIMessage<typeof createAgent>;

export const Route = createFileRoute('/api/chat/')({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const { messages, model }: { messages: UIMessage[]; model: ModelName } =
					await request.json();

				try {
					return createAgentUIStreamResponse({
						agent: createAgent(model),
						messages,
					});
				} catch (error) {
					console.error(error);
					return new Response(JSON.stringify(error), {
						status: 500,
						headers: { 'Content-Type': 'application/json' },
					});
				}
			},
		},
	},
});
