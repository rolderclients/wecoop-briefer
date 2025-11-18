import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { getSessionUser, type SecureUser } from '@/api';
import { App } from '@/app';
import appCss from '../styles.css';

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
	user?: SecureUser;
}>()({
	beforeLoad: async () => {
		const user = await getSessionUser();

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
