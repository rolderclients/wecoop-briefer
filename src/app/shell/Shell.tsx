import { AppShell } from '@mantine/core';
import { Outlet } from '@tanstack/react-router';
import { ScrollArea } from '@/components';
import { useAuth } from '../auth';
import { Navbar } from './Navbar';

export const Shell = () => {
	const { user } = useAuth();

	return (
		<AppShell
			navbar={{
				width: 160,
				breakpoint: 0,
			}}
			disabled={!user || !!user?.banned}
		>
			<Navbar />

			<AppShell.Main>
				<ScrollArea h="100vh" px="xl">
					<Outlet />
					<ScrollArea.ScrollButton />
				</ScrollArea>
			</AppShell.Main>
		</AppShell>
	);
};
