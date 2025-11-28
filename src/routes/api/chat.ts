import { createFileRoute } from '@tanstack/react-router';
import { aiRequest } from '@/back';
import { authMiddleware } from '@/lib/authMiddleware';

export const Route = createFileRoute('/api/chat')({
	server: {
		middleware: [authMiddleware],
		handlers: {
			POST: aiRequest,
		},
	},
});
