import { Grid, Stack } from '@mantine/core';
import { TasksList } from './TasksList';
import { TasksProvider } from './TasksProvider';

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
