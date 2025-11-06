import { AppShell, ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { IconAi, IconChecklist, IconList } from '@tabler/icons-react';
import { HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Navbar, type NavbarLinkProps, ScrollArea } from '@/components';

const menu: NavbarLinkProps[] = [
	{ label: 'Услуги', icon: IconList, pathname: '/services' },
	{ label: 'Промты', icon: IconAi, pathname: '/prompts' },
	{ label: 'Задачи', icon: IconChecklist, pathname: '/tasks' },
];
const SetTimeZoneCookie = () => {
	useEffect(() => {
		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		// biome-ignore lint/suspicious/noDocumentCookie: <>
		document.cookie = `tz=${tz}; path=/; max-age=31536000`;
	}, []);
	return null;
};

export const App = () => {
	return (
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
							<ScrollArea h="100vh" px="xl">
								<Outlet />
								<ScrollArea.ScrollButton />
							</ScrollArea>
						</AppShell.Main>
					</AppShell>
				</MantineProvider>

				<SetTimeZoneCookie />

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
};
