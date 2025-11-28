import { createAgentUIStreamResponse, type UIMessage } from 'ai';
import { createAgent } from './agent';
import type { ModelName } from './types';

export const aiRequest = async ({ request }: { request: Request }) => {
	const {
		messages,
		model,
		prompt,
	}: {
		messages: UIMessage[];
		model?: ModelName;
		prompt?: string;
	} = await request.json();

	try {
		return createAgentUIStreamResponse({
			agent: createAgent(model, prompt),
			messages,
		});
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify(error), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};
