import { createFileRoute, redirect } from '@tanstack/react-router';
import { menu } from '@/app';

export const Route = createFileRoute('/_authed')({
	beforeLoad: ({ context, location }) => {
		const role = context.session?.user?.role;

		if (!role) {
			throw redirect({
				to: '/login',
				search: { redirect: location.href },
			});
		} else {
			const hasAccess = menu.some(
				(i) => i.access.includes(role) && location.pathname === i.pathname,
			);
			if (!hasAccess) throw redirect({ to: '/forbidden' });
		}
	},
});
