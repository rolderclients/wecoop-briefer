import { AppShell, ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import {
	type Icon,
	IconAi,
	IconChecklist,
	IconList,
} from '@tabler/icons-react';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { HeadContent, Scripts } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import {
	Navbar,
	type NavbarLinkProps,
	SidebarProvider,
	ThemeProvider,
} from '@/components';

const menu: NavbarLinkProps[] = [
	{ label: 'Услуги', icon: IconList, pathname: '/services' },
	{ label: 'Промты', icon: IconAi, pathname: '/prompts' },
	{ label: 'Задачи', icon: IconChecklist, pathname: '/tasks' },
];

export const App = ({ children }: { children: React.ReactNode }) => (
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
					padding="xl"
				>
					{/*<Navbar />
					<Outlet />*/}
				</AppShell>

				{/*<ThemeProvider>*/}
				<SidebarProvider>
					<Navbar menu={menu} />
					<main className="w-full">{children}</main>
				</SidebarProvider>
				{/*</ThemeProvider>*/}
			</MantineProvider>

			<TanStackDevtools
				config={{
					position: 'bottom-right',
				}}
				plugins={[
					{
						name: 'Tanstack Router',
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/>

			<Scripts />
		</body>
	</html>
);
