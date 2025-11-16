import { createFileRoute } from '@tanstack/react-router';
import { createAgentUIStreamResponse, type UIMessage } from 'ai';
import { createAgent, type ModelName } from '@/api';

export const Route = createFileRoute('/api/chat')({
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

				try {
					return createAgentUIStreamResponse({
						agent: createAgent(model, userPrompt),
						messages,
					})
				} catch (error) {
					console.error(error);
					return new Response(JSON.stringify(error), {
						status: 500,
						headers: { 'Content-Type': 'application/json' },
					})
				}
			},
		},
	},
});
