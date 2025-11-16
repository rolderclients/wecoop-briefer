import { Stack } from '@mantine/core';
import { UsersList } from './List';
import { Panel } from './Panel';
import { UsersProvider } from './Provider';

export const UsersPage = () => (
	<UsersProvider>
		<Stack py="xl">
			<Panel />
			<UsersList />
		</Stack>
	</UsersProvider>
);
