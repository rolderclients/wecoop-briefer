import { createFileRoute, redirect } from '@tanstack/react-router';
import { menu } from '@/app/shell';

export const Route = createFileRoute('/_authed')({
	beforeLoad: async ({ context, location }) => {
		const role = context?.user?.role;

		if (!role) {
			throw redirect({
				to: '/auth/signin',
				search: { redirectPath: location.href },
			});
		} else {
			const hasAccess = menu.some(
				(i) =>
					i.access.includes(role) && location.pathname.includes(i.pathname),
			);
			if (!hasAccess) throw redirect({ to: '/auth/forbidden' });
		}
	},
});
