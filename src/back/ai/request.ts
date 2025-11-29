import { createAgentUIStreamResponse } from 'ai';
import { nanoid } from 'nanoid';
import { addChatMessageFn } from '../db';
import { createAgent } from './agent';
import type { AgentUIMessage, ModelName } from './types';

export const aiRequest = async ({ request }: { request: Request }) => {
	const {
		messages,
		model,
		prompt,
		chatId,
	}: {
		messages: AgentUIMessage[];
		model?: ModelName;
		prompt?: string;
		chatId?: string;
	} = await request.json();

	if (!chatId)
		throw new Response('chatId is required', {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});

	try {
		const lastMessage = messages[messages.length - 1];
		addChatMessageFn({ data: { id: chatId, message: lastMessage } });

		return createAgentUIStreamResponse({
			agent: createAgent(model, prompt),
			messages,
			onFinish: async ({ responseMessage }) => {
				const message = responseMessage as AgentUIMessage;
				message.id = nanoid(16);
				addChatMessageFn({
					data: { id: chatId, message },
				});
			},
		});
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify(error), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};
