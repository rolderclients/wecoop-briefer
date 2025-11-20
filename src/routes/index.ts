import { createFileRoute, redirect } from '@tanstack/react-router';
import { getSessionUser } from '@/api';

export const Route = createFileRoute('/')({
	beforeLoad: async () => {
		const user = await getSessionUser();
		console.log('========================', user);
		return { user };
	},
	// beforeLoad: async ({ context, location }) => {
	// 	const role = context.user?.role;
	// 	if (!role) throw redirect({ to: '/login' });
	// 	else if (location.pathname === '/') {
	// 		if (role === 'admin')
	// 			throw redirect({
	// 				to: '/services',
	// 				replace: true,
	// 			});
	// 		if (role === 'manager')
	// 			throw redirect({
	// 				to: '/tasks',
	// 				replace: true,
	// 			});
	// 	}
	// },
});
