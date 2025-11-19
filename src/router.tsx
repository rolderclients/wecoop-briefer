import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
// import { CatchBoundary, NotFound } from './app';
import { routeTree } from './routeTree.gen';

export const getRouter = async () => {
	const queryClient = new QueryClient();

	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		context: { queryClient },
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
