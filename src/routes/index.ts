import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	beforeLoad: async ({ context, location }) => {
		const user = context.user;

		if (!user) {
			throw redirect({
				to: '/auth/signin',
				search: { redirectPath: location.href },
			});
		} else if (location.pathname === '/') {
			throw redirect({
				to: '/tasks',
				replace: true,
			});
		}
	},
});
