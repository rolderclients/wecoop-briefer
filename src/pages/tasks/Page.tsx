import { Grid, Stack } from '@mantine/core';
import { TasksList } from './List';
import { TasksProvider } from './Provider';

export const TasksPage = () => (
	<TasksProvider>
		<Stack py="xl">
			<Grid px="md" c="dimmed">
				<Grid.Col span="auto">Название</Grid.Col>
			</Grid>

			<TasksList />
		</Stack>
	</TasksProvider>
);
