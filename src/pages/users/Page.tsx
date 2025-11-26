import { Stack } from '@mantine/core';
import { UsersList } from './components/List';
import { Create, Delete, Edit, EditCredentials } from './forms';
import { UsersProvider } from './provider';

export const UsersPage = () => (
	<UsersProvider>
		<Stack py="xl">
			<Create />
			<Edit />
			<EditCredentials />
			<Delete />

			<UsersList />
		</Stack>
	</UsersProvider>
);
