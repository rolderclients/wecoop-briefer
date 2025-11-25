import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { App, type User } from '@/app';
import { getUserFn } from '@/app/auth/better';
import appCss from '../styles.css?url';

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
	user?: User;
}>()({
	beforeLoad: async () => {
		const user = await getUserFn();
		return { user };
	},
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				title: 'Wecoop Briefer',
			},
			{
				name: 'description',
				content: 'Wecoop Briefer',
			},
		],
		links: [
			{
				rel: 'stylesheet',
				href: appCss,
			},
		],
	}),
	shellComponent: App,
});
