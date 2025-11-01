import { AppShell, ScrollArea, Stack } from '@mantine/core';
import { IconAi, IconChecklist, IconList } from '@tabler/icons-react';
import { useLocation } from '@tanstack/react-router';
import { NavbarLink, type NavbarLinkProps } from './NavbarLink';

const menu: NavbarLinkProps[] = [
  { label: 'Услуги', icon: IconList, pathname: '/services' },
  { label: 'Промты', icon: IconAi, pathname: '/prompts' },
  { label: 'Задачи', icon: IconChecklist, pathname: '/tasks' },
];

export const Navbar = () => {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const links = menu.map((i) => (
    <NavbarLink
      {...i}
      defaultOpened={i.childLinks?.some((l) => l.pathname === pathname)}
      key={i.label}
    />
  ));

  return (
    <AppShell.Navbar>
      <AppShell.Section grow component={ScrollArea} type="never">
        <Stack py="xl" gap={0}>
          {links}
        </Stack>
      </AppShell.Section>
    </AppShell.Navbar>
  );
};
