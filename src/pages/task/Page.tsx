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
import dayjs from 'dayjs';
import { useState } from 'react';
import { taskWithBriefAndChatQueryOptions } from '@/back';
import {
	commentsQueryOptions,
	createCommentFn,
} from '@/back/db/repositories/comment';
import { Textarea } from '@/components/ui/textarea';
import { downloadPDF, SimpleEditor, useMutaitionWithInvalidate } from '@/front';
import { Route } from '@/routes/task.$taskId';
import type { Comment, CreateComment } from '@/types';
import { ScrollArea } from '~/ui';

export const UnautorizedTaskPage = () => {
	// Входные данные
	const { taskId } = useParams({ from: Route.id });
	const { data: comments } = useSuspenseQuery(
		commentsQueryOptions(`task:${taskId}`),
	);
	const { data: task } = useSuspenseQuery(
		taskWithBriefAndChatQueryOptions({ id: `task:${taskId}`, archived: false }),
	);

	// Состояния
	const [newComment, setNewComment] = useState<string>('');
	const [createButtonLoading, setCreateButtonLoading] =
		useState<boolean>(false);
	const [downloading, setDownloading] = useState<boolean>(false);
	const [openedModal, { open, close }] = useDisclosure(false);

	// Функции и хуки
	const createMutation = useMutaitionWithInvalidate<CreateComment>(
		createCommentFn,
		['comments', task.id],
	);

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
									loading={downloading}
									component="div"
									size="xs"
									leftSection={<IconFileTypePdf size={16} />}
									onClick={async () => {
										setDownloading(true);
										await downloadPDF(task.brief?.content || '', 'brief.pdf');
										setDownloading(false);
									}}
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
								<ScrollArea
									autoScroll={true}
									scrollToBottomOnInit={true}
									p="xl"
									h="calc(100vh - 300px)"
								>
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
																{dayjs(iComment.time.created).format(
																	'DD.MM.YY hh:mm',
																)}
															</Text>
														</Group>
														<Group p="xs">
															<Text c="teal" style={{ whiteSpace: 'pre-wrap' }}>
																{iComment.value}
															</Text>
														</Group>
													</Stack>
												</Paper>
											);
										})}
									</Stack>
									<ScrollArea.ScrollButton />
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
							loading={createButtonLoading}
							radius="xl"
							size="xs"
							bg="green"
							onClick={async () => {
								setCreateButtonLoading(true);
								await createMutation.mutateAsync({
									value: newComment,
									task: task.id,
								});
								setNewComment('');
								setCreateButtonLoading(false);
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
