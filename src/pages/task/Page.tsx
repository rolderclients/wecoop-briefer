import {
	Button,
	Grid,
	Group,
	Modal,
	Paper,
	ScrollArea,
	Stack,
	Text,
	Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFileTypePdf } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { taskWithBriefAndCommentsQueryOptions } from '@/back';
import { createCommentFn } from '@/back/db/repositories/comment';
import { Textarea } from '@/components/ui/textarea';
import {
	DefaultNotFoundComponent,
	downloadPDF,
	SimpleEditor,
	useMutaitionWithInvalidate,
} from '@/front';
import { Route } from '@/routes/task.$taskId';
import type { Comment, CreateComment } from '@/types';

export const UnautorizedTaskPage = () => {
	// Входные данные
	const { taskId } = useParams({ from: Route.id });
	const { data: task } = useSuspenseQuery(
		taskWithBriefAndCommentsQueryOptions(`task:${taskId}`),
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
		['taskWithBriefAndComments', task.id],
	);

	// Скролим вниз, при открытии страницы
	const viewport = useRef<HTMLDivElement>(null);

	const scrollToBottom = useCallback(() => {
		if (viewport.current) {
			viewport.current.scrollTo({
				top: viewport.current.scrollHeight,
				behavior: 'smooth',
			});
		}
	}, []);

	// При добавлении комментариев скролим вниз
	useEffect(() => {
		if (task?.comments?.length) scrollToBottom();
	}, [task.comments, scrollToBottom]);

	if (task) {
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
										type="hover"
										offsetScrollbars={false}
										p="xl"
										h="calc(100vh - 300px)"
										viewportRef={viewport}
									>
										<Stack>
											{task.comments?.map((iComment: Comment) => {
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
																<Text
																	c="teal"
																	style={{ whiteSpace: 'pre-wrap' }}
																>
																	{iComment.content}
																</Text>
															</Group>
														</Stack>
													</Paper>
												);
											})}
										</Stack>
										{/*<ScrollArea.ScrollButton />*/}
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
										content: newComment,
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
	} else {
		return <DefaultNotFoundComponent></DefaultNotFoundComponent>;
	}
};
