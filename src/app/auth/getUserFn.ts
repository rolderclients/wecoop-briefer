import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import type { UserWithRole } from 'better-auth/plugins';
import { auth } from '@/lib';

export const getUserFn = createServerFn({ method: 'GET' }).handler(async () => {
	const headers = getRequestHeaders();

	const session = await auth.api.getSession({ headers });

	return session?.user as UserWithRole | undefined;
});
