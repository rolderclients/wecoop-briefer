import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '@/app/auth/better/middleware';
// import { aiRequest } from '@/api';

export const Route = createFileRoute('/api/chat')({
	server: {
		middleware: [authMiddleware],
		handlers: {
			// POST: aiRequest,
			GET: () => {
				return new Response('TEST AUTH');
			},
		},
	},
});
