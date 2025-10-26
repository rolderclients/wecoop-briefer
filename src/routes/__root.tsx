import { Button } from '@mantine/core';
import mantineCss from '@mantine/core/styles.css?url';
import mantineNotificationsCss from '@mantine/notifications/styles.css?url';
import { Default404Page } from '@rolder/ui-kit-react';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link } from '@tanstack/react-router';
import { DefaultCatchBoundary } from '@/components/DefaultCatchBoundary';
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
        title: 'Rolder UI Kit Showcase',
      },
      {
        name: 'description',
        content: 'Rolder UI Kit Showcase',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: mantineCss,
      },
      {
        rel: 'stylesheet',
        href: mantineNotificationsCss,
      },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => (
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
  component: App,
});
