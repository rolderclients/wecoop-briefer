import mantineNotificationsCss from '@mantine/notifications/styles.css?url';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext } from '@tanstack/react-router';
import appCss from '../styles.css?url';
import { App } from './-App';

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
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
