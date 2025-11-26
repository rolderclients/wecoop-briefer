import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import type { User } from '@/app';
import { auth } from '@/lib';

const getUsersFn = createServerFn({ method: 'GET' }).handler(async () => {
	const headers = getRequestHeaders();
	const { users } = await auth.api.listUsers({
		headers,
		query: {
			sortBy: 'createdAt',
			sortDirection: 'desc',
		},
	});

	return users as User[];
});

export const usersQueryOptions = () =>
	queryOptions<User[]>({
		queryKey: ['users'],
		queryFn: getUsersFn,
	});
