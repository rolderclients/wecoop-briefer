import {
	Button,
	Grid,
	Group,
	Modal,
	Paper,
	Stack,
	Text,
	Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFileTypePdf } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { createTaskFn, taskWithBriefAndChatQueryOptions } from '@/back';
import {
	commentsQueryOptions,
	createCommentFn,
} from '@/back/db/repositories/comment';
import { Textarea } from '@/components/ui/textarea';
import { SimpleEditor, useMutaitionWithInvalidate } from '@/front';
import { Route } from '@/routes/task.$taskId';
import type { Comment, CreateComment, TaskWithBriefAndChat } from '@/types';
import { ScrollArea } from '~/ui';

// Сделал фрон для добавления комментариев при просмотре задачи
// const createCommentSchema = z.object({
// 	title: string,
// 	content: z.string().optional(),
// 	company: z
// 		.object({
// 			title: z.string().optional(),
// 			info: z.string().optional(),
// 		})
// 		.optional(),
// 	service: z.string().min(1, 'Услуга обязательна'),
// });

// const createCommentForTask = async (
// 	comment: string,
// 	task: TaskWithBriefAndChat,
// ) => {
// 	console.log(comment, task);

// 	await createMutation.mutateAsync(value);
// 	// notifications.show({
// 	// 	message: `Задача "${value.title}" создана`,
// 	// 	color: 'green',
// 	// });
// };

export const UnautorizedTaskPage = () => {
	const { taskId } = useParams({ from: Route.id });
	const { data: comments } = useSuspenseQuery(
		commentsQueryOptions({ task: `task:${taskId}` }),
	);
	const { data: task } = useSuspenseQuery(
		taskWithBriefAndChatQueryOptions({ id: `task:${taskId}`, archived: false }),
	);

	const [openedModal, { open, close }] = useDisclosure(false);
	const [newComment, setNewComment] = useState<string>('');

	const createMutation = useMutaitionWithInvalidate<CreateComment>(
		createCommentFn,
		['commnets'],
	);

	console.log('taskId', taskId);
	console.log('task', task);
	console.log('comments', comments);

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
								<Button
									disabled={true}
									component="div"
									size="xs"
									color="green"
									variant="light"
								>
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
							<Stack justify="space-between" h="100%">
								<ScrollArea p="xl" h="calc(100vh - 300px)">
									<Stack>
										{comments?.map((iComment: Comment) => {
											return (
												<Paper
													key={iComment.id}
													withBorder
													radius="md"
													h="100%"
												>
													<Stack gap={0} align="stretch">
														<Group
															pt="xs"
															pr="xs"
															pl="xs"
															pb={0}
															justify="space-between"
														>
															<Text c="cyan" size="xs">
																{task.company.title}
															</Text>
															<Text c="cyan" size="xs">
																{'05.12.25'}
															</Text>
														</Group>
														<Group p="xs">
															<Text c="teal">{iComment.value}</Text>
														</Group>
													</Stack>
												</Paper>
											);
										})}
									</Stack>
								</ScrollArea>
								<Group w="100%" justify="center" mb="50px">
									<Button radius="xl" bg="green" onClick={open}>
										Добавить комментарий
									</Button>
								</Group>
							</Stack>
						</Paper>
					</Stack>
				</Grid.Col>
			</Grid>
			<Modal
				size="50%"
				opened={openedModal}
				onClose={close}
				title="Новый комментарий"
			>
				<Stack>
					<Textarea
						value={newComment}
						onChange={(event) => setNewComment(event.currentTarget.value)}
					></Textarea>
					<Group w="100%" justify="flex-end">
						<Button
							radius="xl"
							size="xs"
							bg="green"
							onClick={async () => {
								await createMutation.mutateAsync({
									value: newComment,
									task: task.id,
								});
								close();
							}}
						>
							Добавить комментарий
						</Button>
					</Group>
				</Stack>
			</Modal>
		</Stack>
	);
};
