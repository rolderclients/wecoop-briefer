import { AppShell, ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { useEffect } from 'react';
import { ScrollArea } from '@/kit';
import { Navbar } from './Navbar';

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
						<Navbar />

						<AppShell.Main>
							<ScrollArea h="100vh" px="xl">
								<Outlet />
								<ScrollArea.ScrollButton />
							</ScrollArea>
						</AppShell.Main>
					</AppShell>
				</MantineProvider>

				<SetTimeZoneCookie />

				<Scripts />
			</body>
		</html>
	);
};
