import {
	ActionIcon,
	AppShell,
	Avatar,
	Group,
	HoverCard,
	NavLink,
	ScrollArea,
	Stack,
	ThemeIcon,
	Title,
} from '@mantine/core';
import type { Icon } from '@tabler/icons-react';
import {
	IconAi,
	IconChecklist,
	IconList,
	IconLogout,
	IconUser,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../auth';

// import { revokeSessions, useAuth } from './auth';
// import { serverSignOutFn } from './auth/test';

interface NavbarLinkProps {
	label: string;
	pathname: string;
	icon: Icon;
	access: string[];
}

export const menu: NavbarLinkProps[] = [
	{ label: 'Услуги', pathname: '/services', icon: IconList, access: ['admin'] },
	{ label: 'Промты', pathname: '/prompts', icon: IconAi, access: ['admin'] },
	{
		label: 'Задачи',
		pathname: '/tasks',
		icon: IconChecklist,
		access: ['admin', 'manager'],
	},
	{
		label: 'Сотрудники',
		pathname: '/users',
		icon: IconUser,
		access: ['admin'],
	},
];

export const Navbar = () => {
	const { user, signOut } = useAuth();

	return (
		<AppShell.Navbar>
			<AppShell.Section>
				<Title order={3} ta="center" py="md">
					WECOOP
				</Title>
			</AppShell.Section>

			<AppShell.Section grow component={ScrollArea} type="never">
				<Stack gap={0}>
					{menu
						.filter(({ access }) => user?.role && access.includes(user?.role))
						.map(({ label, pathname, icon: Icon }) => (
							<Link
								key={label}
								to={pathname}
								style={{ textDecoration: 'none', color: 'inherit' }}
							>
								{({ isActive }: { isActive: boolean }) => {
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

			<AppShell.Section p="sm">
				<HoverCard width={280} shadow="md" radius="md" position="top-start">
					<HoverCard.Target>
						<Group gap="xs" wrap="nowrap">
							<Avatar color="blue" variant="light">
								<IconUser />
							</Avatar>
							<Title order={5}>Профиль</Title>
						</Group>
					</HoverCard.Target>
					<HoverCard.Dropdown>
						<Group w="100%" gap="xs" wrap="nowrap" justify="space-between">
							<Title order={5}>{user?.name}</Title>
							<ActionIcon variant="light" size="lg" onClick={signOut}>
								<IconLogout />
							</ActionIcon>
						</Group>
					</HoverCard.Dropdown>
				</HoverCard>
			</AppShell.Section>
		</AppShell.Navbar>
	);
};
