import { createFileRoute } from '@tanstack/react-router';
import { aiRequest } from '@/api';
import { authMiddleware } from '@/app/auth/better/middleware';

export const Route = createFileRoute('/api/chat')({
	server: {
		middleware: [authMiddleware],
		handlers: {
			POST: aiRequest,
		},
	},
});
