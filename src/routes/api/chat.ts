import { createFileRoute } from '@tanstack/react-router';
import { aiRequest, authMiddleware } from '@/back';

export const Route = createFileRoute('/api/chat')({
	server: {
		middleware: [authMiddleware],
		handlers: {
			POST: aiRequest,
		},
	},
});
