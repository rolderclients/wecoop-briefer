import {
	Box,
	Button,
	CopyButton,
	Grid,
	Group,
	Paper,
	Stack,
	Text,
	Title,
} from '@mantine/core';
import { IconEdit, IconFileTypePdf } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { taskWithBriefAndChatQueryOptions } from '@/back';
import { downloadPDF, Files, SimpleEditor } from '@/front';

import { Route } from '@/routes/_authed/tasks/$taskId';
import { ScrollArea } from '~/ui';
import { TaskFiles } from './Files';

export const TaskPage = () => {
	const { taskId } = useParams({ from: Route.id });
	const { data: task } = useSuspenseQuery(
		taskWithBriefAndChatQueryOptions({ id: taskId, archived: false }),
	);

	const [downloading, setDownloading] = useState<boolean>(false);
	const [currentTaskURL, setCurrentTaskURL] = useState<string>('');

	useEffect(() => {
		console.log('url', `${location.origin}/task/${taskId}`);
		setCurrentTaskURL(`${location.origin}/task/${taskId}`);
	}, [taskId]);

	return (
		<Stack pb="xl" pt="sm">
			<Group justify="space-between">
				<Group justify="flex-start">
					<Title>{task.title}</Title>
					<CopyButton value={currentTaskURL}>
						{({ copied, copy }) => (
							<Button color={copied ? 'teal' : 'blue'} onClick={copy}>
								{copied ? 'Ссылка скопирована' : 'Сформировать ссылку'}
							</Button>
						)}
					</CopyButton>
				</Group>
				<Text c="dimmed">
					Дата создания:{' '}
					<Text c="var(--mantine-color-text)" span>
						{task.time.created}
					</Text>
				</Text>
			</Group>

			<Grid gutter="xl" overflow="hidden">
				<Grid.Col span={4}>
					<Stack gap="xs">
						<Group justify="space-between">
							<Title order={3}>Задание</Title>
							<Button size="xs" leftSection={<IconEdit size={16} />}>
								Редактировать
							</Button>
						</Group>
						<Paper withBorder radius="md">
							<ScrollArea h="calc(100vh - 147px)">
								<Stack px="md" py="sm" h="100%">
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

									<Files.Provider route="upload">
										<TaskFiles taskId={task.id} />
									</Files.Provider>
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

							<Group>
								<Button
									loading={downloading}
									component="div"
									size="xs"
									color="green"
									variant="light"
									leftSection={<IconFileTypePdf size={16} />}
									onClick={async () => {
										setDownloading(true);
										await downloadPDF(task.brief?.content || '', 'brief.pdf');
										setDownloading(false);
									}}
								>
									Скачать PDF
								</Button>

								<Link
									key={task.id}
									to="/tasks/$taskId/brief"
									params={{ taskId: task.id }}
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
						</Group>

						<SimpleEditor
							height="calc(100vh - 147px)"
							initialContent={task.brief?.content}
							initialEditable={false}
							initialDisabledToolbar
						/>
					</Stack>
				</Grid.Col>
			</Grid>
		</Stack>
	);
};
