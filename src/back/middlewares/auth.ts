import { createMiddleware } from '@tanstack/react-start';
import { getUserFn } from '../functions';

export const authMiddleware = createMiddleware().server(async ({ next }) => {
	const user = await getUserFn();
	if (!user) throw new Response('Unauthorized', { status: 401 });
	return next();
});
