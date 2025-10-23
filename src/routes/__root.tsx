import {
  AppShell,
  Button,
  ColorSchemeScript,
  Group,
  MantineProvider,
  mantineHtmlProps,
  Title,
} from '@mantine/core';
import mantineCss from '@mantine/core/styles.css?url';
import { Default404Page } from '@rolder/ui-kit-react';
import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { Navbar } from '@/components';
import { DefaultCatchBoundary } from '@/components/DefaultCatchBoundary';

export const Route = createRootRoute({
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
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <AppShell
        header={{ height: 64 }}
        navbar={{
          width: 160,
          breakpoint: 'sm',
        }}
        padding="xl"
      >
        <AppShell.Header
          style={{
            borderBottom: '1px solid var(--app-shell-border-color)',
            backgroundColor:
              'color-mix(in srgb,var(--mantine-color-body),transparent 85%)',
            backdropFilter: 'blur(5px)',
          }}
        >
          <Group h="100%" px="xl" justify="space-between">
            <Title order={3}>Wecoop</Title>
            <Title order={5}>Пользователь</Title>
          </Group>
        </AppShell.Header>
        <Navbar />
        <Outlet />
      </AppShell>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru" {...mantineHtmlProps}>
      <head>
        <HeadContent />
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <MantineProvider defaultColorScheme="light">
          {children}
          <Scripts />
        </MantineProvider>
      </body>
    </html>
  );
}
