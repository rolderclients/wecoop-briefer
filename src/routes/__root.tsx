import mantineNotificationsCss from '@mantine/notifications/styles.css?url';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { type AppSession, getAppSession } from '@/api';
import { App } from '@/app';
import appCss from '../styles.css?url';

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
	session?: AppSession | null;
}>()({
	beforeLoad: async () => {
		const session = await getAppSession();

		return { session };
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
			{
				rel: 'stylesheet',
				href: mantineNotificationsCss,
			},
		],
	}),
	shellComponent: App,
});
