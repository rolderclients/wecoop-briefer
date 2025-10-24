import { Button } from '@mantine/core';
import { Default404Page } from '@rolder/ui-kit-react';
import { QueryClient } from '@tanstack/react-query';
import { createRouter, Link } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => (
      <Default404Page
        h="100vh"
        ml={160}
        gotoHomeComponent={
          <Link to="/" preload="intent">
            <Button mt="xl" component="div" size="lg">
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
}
