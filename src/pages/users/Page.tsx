import { Stack } from '@mantine/core';
import { Create, Delete, Edit, EditCredentials } from './forms';
import { UsersProvider } from './Provider';
import { Users } from './Users';

export const UsersPage = () => (
	<UsersProvider>
		<Stack py="xl">
			<Create />
			<Edit />
			<EditCredentials />
			<Delete />

			<Users />
		</Stack>
	</UsersProvider>
);
