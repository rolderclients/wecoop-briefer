import {
	AppShell,
	NavLink,
	ScrollArea,
	Stack,
	ThemeIcon,
	Title,
} from '@mantine/core';
import type { Icon } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';

export interface NavbarLinkProps {
	label: string;
	pathname?: string;
	icon: Icon;
}

export const Navbar = ({ menu }: { menu: NavbarLinkProps[] }) => (
	<AppShell.Navbar>
		<AppShell.Section>
			<Title order={3} ta="center" py="md">
				WECOOP
			</Title>
		</AppShell.Section>

		<AppShell.Section grow component={ScrollArea} type="never">
			<Stack gap={0}>
				{menu.map(({ label, pathname, icon: Icon }) => (
					<Link
						key={label}
						to={pathname}
						style={{ textDecoration: 'none', color: 'inherit' }}
					>
						{({ isActive }) => {
							return (
								<NavLink
									component="div"
									label={label}
									active={isActive}
									style={{
										borderLeft:
											'1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
									}}
									leftSection={
										<ThemeIcon variant="light" size={30}>
											<Icon size={18} />
										</ThemeIcon>
									}
								/>
							);
						}}
					</Link>
				))}
			</Stack>
		</AppShell.Section>

		<AppShell.Section>
			<Title order={5} ta="center" py="md">
				Пользователь
			</Title>
		</AppShell.Section>
	</AppShell.Navbar>
);
