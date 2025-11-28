import { createFileRoute } from '@tanstack/react-router';
import { usersQueryOptions } from '@/lib/usersQueryOptions';
import { UsersPage } from '@/pages';

export const Route = createFileRoute('/_authed/users')({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(usersQueryOptions());
	},
	component: UsersPage,
});
