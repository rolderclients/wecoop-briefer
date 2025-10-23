import { AppShell, type AppShellMainProps } from '@mantine/core';

export const Page = (props: AppShellMainProps) => {
  const { children, ...rest } = props;

  return <AppShell.Main {...rest}>{children}</AppShell.Main>;
};
