import { AppShell } from '@mantine/core';
import { Outlet } from '@tanstack/react-router';
import { ScrollArea } from '@/kit';
import { useAuth } from './auth';
import { Navbar } from './Navbar';

export const Shell = () => {
	const { authed } = useAuth();

	return (
		<AppShell
			navbar={{
				width: 160,
				breakpoint: 0,
			}}
			disabled={!authed}
		>
			<Navbar />

			<AppShell.Main>
				<ScrollArea h="100vh" px="xl">
					TEST
					<Outlet />
					<ScrollArea.ScrollButton />
				</ScrollArea>
			</AppShell.Main>
		</AppShell>
	);
};
