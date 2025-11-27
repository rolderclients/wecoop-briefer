import {
	ActionIcon,
	Box,
	Checkbox,
	Grid,
	Paper,
	Space,
	Stack,
	Text,
} from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import type { Task } from '@/app';
import classes from '@/app/styles.module.css';
import { useTasks } from '../Provider';

export const TasksList = () => {
	const { tasks } = useTasks();

	return (
		<Stack mt="sm">
			<Grid px="md" c="dimmed">
				<Grid.Col span="content">
					<Space w={20} />
				</Grid.Col>
				<Grid.Col span="auto">Название</Grid.Col>
				<Grid.Col span="auto">Услуга</Grid.Col>
				<Grid.Col span="auto">Компания</Grid.Col>
				<Grid.Col span="content">
					<Space w={28} />
				</Grid.Col>
			</Grid>

			{tasks.map((task) => (
				<TaskPaper key={task.id} task={task}></TaskPaper>
			))}
		</Stack>
	);
};

const TaskPaper = ({ task }: { task: Task }) => {
	const { hovered, ref } = useHover();
	const { selectedIds, setSelectedIds, isArchived, openEdit, setSelectedTask } =
		useTasks();

	return (
		<Paper ref={ref} radius="md" withBorder>
			<Grid px="md" py="xs" align="center">
				<Grid.Col span="content">
					<Checkbox
						checked={selectedIds.includes(task.id)}
						onChange={(e) => {
							setSelectedIds(
								e.currentTarget.checked
									? [...selectedIds, task.id]
									: selectedIds.filter((id) => id !== task.id),
							);
						}}
					/>
				</Grid.Col>
				<Grid.Col span="auto">
					<Text inline>{task.title}</Text>
				</Grid.Col>
				<Grid.Col span="auto">
					<Text inline>{task.service.title}</Text>
				</Grid.Col>
				<Grid.Col span="auto">
					<Text inline>{task.company.title}</Text>
				</Grid.Col>

				<Grid.Col span="content">
					{isArchived ? (
						<Box h={35.75} w={28} />
					) : (
						<ActionIcon
							aria-label="Изменить"
							className={classes.hoverActionIcon}
							mod={{ hovered }}
							onClick={() => {
								setSelectedTask(task);
								openEdit();
							}}
							mt={4}
						>
							<IconEdit size={20} />
						</ActionIcon>
					)}
				</Grid.Col>
			</Grid>
		</Paper>
	);
};
