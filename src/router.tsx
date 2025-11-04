import { Button } from '@mantine/core';
import { Default404Page } from '@rolder/ui-kit-react';
import { QueryClient } from '@tanstack/react-query';
import { createRouter, Link } from '@tanstack/react-router';
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary';
import { routeTree } from './routeTree.gen';

export const getRouter = () => {
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
				ml={160}
				gotoHomeComponent={
					<Link to="/" preload="intent">
						<Button mt="xl" component="div" size="lg" radius="md">
							На главную
						</Button>
					</Link>
				}
			/>
		),
	});

	return router;
};
