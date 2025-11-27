import { Stack } from '@mantine/core';
import { Create, Delete, Edit, EditCredentials } from './forms';
import { UsersList } from './List';
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
