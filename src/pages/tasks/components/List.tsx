import { Box, Checkbox, Grid, Space, Stack, Text } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import type { Task } from '@/types';
import { HoverActionIcon, HoverPaper, Link, usePaperHover } from '~/ui';
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
	const { paperHovered, paperRef } = usePaperHover();
	const { selectedIds, setSelectedIds, isArchived, openEdit, setSelectedTask } =
		useTasks();

	return (
		<Link
			key={task.id}
			to="/tasks/$taskId"
			params={{ taskId: task.id }}
			disabled={isArchived}
		>
			<HoverPaper
				ref={paperRef}
				radius="md"
				withBorder
				disabled={task.archived}
			>
				<Grid px="md" py="xs" align="center">
					<Grid.Col span="content">
						<Checkbox
							checked={selectedIds.includes(task.id)}
							onClick={(e) => e.stopPropagation()}
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
							<HoverActionIcon
								aria-label="Изменить"
								hovered={paperHovered}
								onClick={(e) => {
									e.preventDefault();
									setSelectedTask(task);
									openEdit();
								}}
								mt={4}
							>
								<IconEdit size={20} />
							</HoverActionIcon>
						)}
					</Grid.Col>
				</Grid>
			</HoverPaper>
		</Link>
	);
};
