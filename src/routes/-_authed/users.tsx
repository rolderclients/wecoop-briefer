import { createFileRoute } from '@tanstack/react-router';
import { usersQueryOptions } from '@/api';
import { UsersPage } from '@/pages';

export const Route = createFileRoute('/_authed/users')({
	loaderDeps: ({ search: { archived } }) => ({ archived }),
	loader: async ({ context, deps: { archived } }) => {
		await context.queryClient.ensureQueryData(usersQueryOptions(archived));
	},
	validateSearch: (search: Record<string, unknown>): { archived?: boolean } => {
		return {
			archived: search?.archived === true ? true : undefined,
		};
	},
	component: UsersPage,
});
