import { createFileRoute } from '@tanstack/react-router';
import { aiRequest } from '@/api';
import { authMiddleware } from '@/app';

export const Route = createFileRoute('/_authed/api/chat')({
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
