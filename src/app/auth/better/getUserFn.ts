import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { auth } from '@/lib/auth';
import type { User } from '../types';

export const getUserFn = createServerFn({ method: 'GET' }).handler(async () => {
	try {
		const headers = getRequestHeaders();

		const session = await auth.api.getSession({ headers });

		return session?.user as User | undefined;
	} catch (_) {
		return undefined;
	}
});
