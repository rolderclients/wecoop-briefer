import { createFileRoute, redirect } from '@tanstack/react-router';
import { getUserFn, menu } from '@/app';

export const Route = createFileRoute('/_authed')({
	beforeLoad: async ({ location }) => {
		const user = await getUserFn();

		console.log(user);

		return { user };

		// if (!role) {
		// 	throw redirect({
		// 		to: '/login',
		// 		search: { redirect: location.href },
		// 	});
		// } else {
		// 	const hasAccess = menu.some(
		// 		(i) =>
		// 			i.access.includes(role) && location.pathname.includes(i.pathname),
		// 	);
		// 	if (!hasAccess) throw redirect({ to: '/forbidden' });
		// }
	},
});
