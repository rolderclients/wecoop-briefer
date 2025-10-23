import { Button } from '@mantine/core';
import { Default404Page } from '@rolder/ui-kit-react';
import { createRouter, Link } from '@tanstack/react-router';
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const router = createRouter({
    routeTree,
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

  return router;
}
