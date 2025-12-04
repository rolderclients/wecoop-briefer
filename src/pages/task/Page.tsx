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
import { IconEdit, IconFileTypePdf } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { taskWithBriefAndChatQueryOptions } from '@/back';
import { SimpleEditor } from '@/front';
import { Route } from '@/routes/task.$taskId';
import { ScrollArea } from '~/ui';

export const UnautorizedTaskPage = () => {
	const { taskId } = useParams({ from: Route.id });
	const { data: task } = useSuspenseQuery(
		taskWithBriefAndChatQueryOptions({ id: taskId, archived: false }),
	);

	const [newComment, setNewComment] = useState<string>('');
	const [comments, setComments] = useState<string[]>([
		'Комментарий 1',
		'Комментарий 2',
	]);

	console.log('taskId', taskId);
	console.log('task', task);

	return (
		<Stack pb="xl" pt="sm">
			<Group justify="flex-end">
				<Text c="var(--mantine-color-text)" size="xl">
					Заказчик
				</Text>
			</Group>

			<Grid columns={10} gutter="xl" overflow="hidden">
				<Grid.Col span={7}>
					<Stack gap="xs">
						<Title order={3}>Задача</Title>

						<Paper withBorder radius="md">
							<Stack px="md" py="sm" h="100%">
								<Text>{task.title}</Text>
							</Stack>
						</Paper>

						<Group justify="space-between" mt="xl">
							<Title order={3}>Бриф</Title>

							<Group>
								<Button component="div" size="xs" color="green" variant="light">
									Просмотр
								</Button>

								<Button
									component="div"
									size="xs"
									leftSection={<IconFileTypePdf size={16} />}
								>
									Скачать
								</Button>
							</Group>
						</Group>

						<SimpleEditor
							height="calc(100vh - 300px)"
							initialContent={task.brief?.content}
							initialEditable={false}
							initialDisabledToolbar
						/>
					</Stack>
				</Grid.Col>

				<Grid.Col span={3}>
					<Stack gap="xs" h="100%">
						<Title order={3}>Ваши комментарии</Title>

						<Paper withBorder radius="md" h="100%">
							<ScrollArea p="xl">
								{comments?.map((iComment) => {
									return (
										<Group key={iComment}>
											<Text>{iComment}</Text>
										</Group>
									);
								})}
								<Group w="100%" justify="center" mt="50px">
									<Button
										radius="xl"
										bg="green"
										onClick={() => {
											console.log('comments', comments);
											setComments([...comments, 'Заглушка']);
										}}
									>
										Добавить комментарий
									</Button>
								</Group>
							</ScrollArea>
						</Paper>
					</Stack>
				</Grid.Col>
			</Grid>
		</Stack>
	);
};
