import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	beforeLoad: async ({ context, location }) => {
		const role = context.user?.role;

		if (!role) {
			throw redirect({
				to: '/auth/login',
				search: { redirect: location.href },
			});
		} else if (location.pathname === '/') {
			if (role === 'admin')
				throw redirect({
					to: '/services',
					replace: true,
				});
			if (role === 'manager')
				throw redirect({
					to: '/tasks',
					replace: true,
				});
		}
	},
});
