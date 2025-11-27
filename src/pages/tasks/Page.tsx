import { Stack } from '@mantine/core';
import { TasksList } from './components';
import { Panel } from './components/Panel';
import { Edit } from './forms';
import { TasksProvider } from './Provider';

export const TasksPage = () => (
	<TasksProvider>
		<Stack py="xl">
			<Panel />

			<TasksList />

			<Edit />
		</Stack>
	</TasksProvider>
);
