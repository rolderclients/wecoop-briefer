import {
  AppShell,
  ColorSchemeScript,
  Group,
  MantineProvider,
  mantineHtmlProps,
  Title,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { Navbar } from '@/components';

export const App = () => (
  <html lang="ru" {...mantineHtmlProps}>
    <head>
      <HeadContent />
      <ColorSchemeScript defaultColorScheme="auto" />
    </head>
    <body>
      <MantineProvider defaultColorScheme="auto">
        <Notifications />
        <AppShell
          header={{ height: 64 }}
          navbar={{
            width: 160,
            breakpoint: 'xs',
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
        <Scripts />
      </MantineProvider>
    </body>
  </html>
);
