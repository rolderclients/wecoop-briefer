import { NavLink, ThemeIcon } from '@mantine/core';
import type { Icon } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';

export interface NavbarLinkProps {
  label: string;
  pathname?: string;
  icon: Icon;
  defaultOpened?: boolean;
  childLinks?: {
    label: string;
    pathname: string;
  }[];
}

export const NavbarLink = ({
  label,
  pathname,
  icon: Icon,
  defaultOpened,
  childLinks,
}: NavbarLinkProps) => {
  return (
    <Link to={pathname} style={{ textDecoration: 'none', color: 'inherit' }}>
      {({ isActive }) => (
        <NavLink
          component="div"
          label={label}
          leftSection={
            <ThemeIcon variant="light" size={30}>
              <Icon size={18} />
            </ThemeIcon>
          }
          childrenOffset={28}
          defaultOpened={defaultOpened}
          active={pathname ? isActive : false}
        >
          {childLinks?.map((i) => (
            <Link
              key={i.label}
              to={i.pathname}
              activeOptions={{ exact: true }}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {({ isActive }) => {
                return (
                  <NavLink
                    component="div"
                    label={i.label}
                    active={isActive}
                    style={{
                      borderLeft:
                        '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
                    }}
                  />
                );
              }}
            </Link>
          ))}
        </NavLink>
      )}
    </Link>
  );
};
