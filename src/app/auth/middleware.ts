import { createMiddleware } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { auth } from '@/lib';

export const authMiddleware = createMiddleware().server(async ({ next }) => {
	const headers = getRequestHeaders();

	const session = await auth.api.getSession({ headers });

	if (!session?.user) {
		throw new Response('Unauthorized', { status: 401 });
	}

	return await next({ context: { session } });
});
