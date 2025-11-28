import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import type { User } from '@/front';
import { auth } from './auth';

export const getUserFn = createServerFn({ method: 'GET' }).handler(async () => {
	try {
		const headers = getRequestHeaders();

		const session = await auth.api.getSession({ headers });

		return session?.user as User | undefined;
	} catch (_) {
		return undefined;
	}
});
