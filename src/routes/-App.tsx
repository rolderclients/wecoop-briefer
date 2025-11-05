import { AppShell, ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { IconAi, IconChecklist, IconList } from '@tabler/icons-react';
import { HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { Navbar, type NavbarLinkProps, ScrollArea } from '@/components';

const menu: NavbarLinkProps[] = [
	{ label: 'Услуги', icon: IconList, pathname: '/services' },
	{ label: 'Промты', icon: IconAi, pathname: '/prompts' },
	{ label: 'Задачи', icon: IconChecklist, pathname: '/tasks' },
];

export const App = () => (
	<html lang="ru" suppressHydrationWarning>
		<head>
			<HeadContent />
			<ColorSchemeScript defaultColorScheme="auto" />
		</head>
		<body>
			<MantineProvider defaultColorScheme="auto">
				<Notifications />

				<AppShell
					navbar={{
						width: 160,
						breakpoint: 0,
					}}
				>
					<Navbar menu={menu} />

					<AppShell.Main>
						<ScrollArea height="100vh">
							<ScrollArea.Content px="xl">
								<Outlet />
								<ScrollArea.ScrollButton />
							</ScrollArea.Content>
						</ScrollArea>
					</AppShell.Main>
				</AppShell>
			</MantineProvider>

			{/*<TanStackDevtools
					config={{
						position: 'bottom-right',
					}}
					plugins={[
						{
							name: 'Tanstack Router',
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>*/}

			<Scripts />
		</body>
	</html>
);
