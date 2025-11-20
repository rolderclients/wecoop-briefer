import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { getSessionUser } from './api';
// import { CatchBoundary, NotFound } from './app';
import { routeTree } from './routeTree.gen';

export const getRouter = async () => {
	const queryClient = new QueryClient();

	const user = await getSessionUser();

	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		context: { queryClient, user },
		defaultPreload: 'intent',
		// defaultErrorComponent: CatchBoundary,
		// defaultNotFoundComponent: NotFound,
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
	});

	return router;
};
