import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import {
	DefaultErrorComponent,
	DefaultNotFoundComponent,
	defaultErrorNotification,
} from './app';
import { routeTree } from './routeTree.gen';

export const getRouter = async () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			mutations: {
				onError: (error) => defaultErrorNotification(error),
			},
		},
	});

	const router = createRouter({
		routeTree,
		context: { queryClient },
		defaultPreload: 'intent',
		defaultErrorComponent: DefaultErrorComponent,
		defaultNotFoundComponent: DefaultNotFoundComponent,
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
	});

	return router;
};
