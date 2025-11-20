import { createFileRoute } from '@tanstack/react-router';
import { aiRequest } from '@/api';

export const Route = createFileRoute('/api/chat')({
	server: {
		handlers: {
			POST: aiRequest,
		},
	},
});
