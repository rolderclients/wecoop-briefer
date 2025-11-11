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
	document: string().describe('Документ в формате HTML.'),
	chat: string().describe('Сообщения в чат для пользователя.'),
});

export type StructuredTextPart = output<typeof schema>;

const createAgent = (
	model: ModelName = 'anthropic/claude-haiku-4.5',
	userPrompt?: string,
) =>
	new ToolLoopAgent({
		model,
		providerOptions,
		instructions: `Структура ответа. В ответе используй два поля:
			- "chat". Здесь пользователь видит свои и твои сообщения. Пользователь видит чат слева, он занимает 3/12 ширины экрана.
			- "document". Здесь пользователь видит содержание документа. Пользователь видит документ справа, он занимает 9/12 ширины экрана.

		Правила работы:
		- Никогда не используй поле "document", если пользователь прямо не просит отредактировать документ.
		- Используй поле "chat":
		  - Когда пользователь задает вопросы или хочет пообщаться.
			- Когда пользователь попросил отредактировать документ. В этом случае нужно написть короткое резуме изменений в документе.

		Ниже правила работы, которые задает пользователь, всегда следуй им.
			${userPrompt}`,

		output: Output.object({ schema }),
	});

export type AgentUIMessage = InferAgentUIMessage<typeof createAgent>;

export const Route = createFileRoute('/api/chat/')({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const {
					messages,
					model,
					userPrompt,
				}: {
					messages: UIMessage[];
					model?: ModelName;
					userPrompt?: string;
				} = await request.json();
				console.log(messages.flatMap((i) => i.parts));
				try {
					return createAgentUIStreamResponse({
						agent: createAgent(model, userPrompt),
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
