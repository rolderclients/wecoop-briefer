import {
	Box,
	Button,
	Grid,
	Group,
	Paper,
	Stack,
	Text,
	Title,
} from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { taskWithBriefQueryOptions } from '@/api';
import { Editor } from '@/components';
import { ScrollArea } from '@/components/kit';
import { Route } from '.';

export const TaskPage = () => {
	const { taskId } = useParams({ from: Route.id });
	const { data: task } = useSuspenseQuery(taskWithBriefQueryOptions(taskId));

	return (
		<Stack pb="xl" pt="sm">
			<Group justify="space-between">
				<Title>{task.title}</Title>
				<Text c="dimmed">
					Дата создания:{' '}
					<Text c="var(--mantine-color-text)" span>
						{new Date(task.time.created).toLocaleDateString('ru-RU', {
							hour: 'numeric',
							minute: 'numeric',
						})}
					</Text>
				</Text>
			</Group>

			<Grid gutter="xl" overflow="hidden">
				<Grid.Col span={4}>
					<Stack gap="xs">
						<Title order={3}>Задание</Title>
						<Paper withBorder radius="md">
							<ScrollArea h="calc(100vh - 147px)">
								<Stack px="md" py="sm">
									<Box style={{ whiteSpace: 'pre-wrap' }}>
										<Text c="dimmed">Компания</Text>
										<Text>{task.company.title}</Text>
									</Box>
									<Box style={{ whiteSpace: 'pre-wrap' }}>
										<Text c="dimmed">О компании</Text>
										<Text>{task.company.info}</Text>
									</Box>
									<Box style={{ whiteSpace: 'pre-wrap' }}>
										<Text c="dimmed">Описание</Text>
										<Text>{task.content}</Text>
									</Box>
								</Stack>

								<ScrollArea.ScrollButton />
							</ScrollArea>
						</Paper>
					</Stack>
				</Grid.Col>

				<Grid.Col span={8}>
					<Stack gap="xs">
						<Group justify="space-between">
							<Title order={3}>Бриф</Title>
							<Link
								key={task.id}
								to="/tasks/$taskId/brief"
								params={{ taskId: task.id }}
								preload="intent"
								reloadDocument={true}
							>
								<Button
									component="div"
									size="xs"
									leftSection={<IconEdit size={16} />}
								>
									Редактировать
								</Button>
							</Link>
						</Group>

						<Editor
							height="calc(100vh - 147px)"
							content={task.brief?.content}
							editable={false}
						/>
					</Stack>
				</Grid.Col>
			</Grid>
		</Stack>
	);
};
