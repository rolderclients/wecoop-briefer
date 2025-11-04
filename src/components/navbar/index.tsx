import type { Icon } from '@tabler/icons-react';
import { Link, useLocation } from '@tanstack/react-router';
import { Text } from '../elements';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '../ui';

export interface NavbarLinkProps {
	label: string;
	pathname?: string;
	icon: Icon;
}

export const Navbar = ({ menu }: { menu: NavbarLinkProps[] }) => {
	const pathname = useLocation({ select: (i) => i.pathname });

	return (
		<Sidebar>
			<SidebarHeader className="items-center">
				<Text variant="h3">Wecoop</Text>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{menu.map((item) => (
								<SidebarMenuItem key={item.pathname}>
									<SidebarMenuButton
										asChild
										isActive={item.pathname === pathname}
									>
										<Link to={item.pathname}>
											<item.icon />
											<span>{item.label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="items-center">
				<Text variant="h6">Пользователь</Text>
			</SidebarFooter>
		</Sidebar>
	);
};
