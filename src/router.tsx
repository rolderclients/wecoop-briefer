import { Button } from '@mantine/core';
import { Default404Page } from '@rolder/ui-kit-react';
import { QueryClient } from '@tanstack/react-query';
import { createRouter, Link } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { DefaultCatchBoundary } from './app';
import { routeTree } from './routeTree.gen';

export const getRouter = async () => {
	const queryClient = new QueryClient();

	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		context: { queryClient },
		defaultPreload: 'intent',
		defaultErrorComponent: DefaultCatchBoundary,
		defaultNotFoundComponent: () => (
			<Default404Page
				h="100vh"
				gotoHomeComponent={
					<Link to="/">
						<Button mt="xl" component="div" size="lg" radius="md">
							На главную
						</Button>
					</Link>
				}
			/>
		),
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
	});

	return router;
};
