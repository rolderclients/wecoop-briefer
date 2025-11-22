import { createFileRoute } from '@tanstack/react-router';
import { aiRequest } from '@/api';
import { authMiddleware } from '@/app/auth/middleware';

export const Route = createFileRoute('/api/chat')({
	server: {
		middleware: [authMiddleware],
		handlers: {
			POST: aiRequest,
			GET: () => {
				return new Response('TEST AUTH');
			},
		},
	},
});
