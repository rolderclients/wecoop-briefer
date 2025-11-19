import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { useEffect } from 'react';

// import { AuthProvider } from './auth';
// import { Shell } from './Shell';

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
					{/*<AuthProvider>*/}
					<Notifications />
					TEST
					<Outlet />
					{/*<Shell />*/}
					{/*</AuthProvider>*/}
				</MantineProvider>

				<SetTimeZoneCookie />

				<Scripts />
			</body>
		</html>
	);
};
