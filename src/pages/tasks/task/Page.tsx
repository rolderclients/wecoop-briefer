import {
	ActionIcon,
	Box,
	Button,
	CopyButton,
	Grid,
	Group,
	Paper,
	Stack,
	Text,
	Title,
	Tooltip,
} from '@mantine/core';
import {
	IMAGE_MIME_TYPE,
	MS_EXCEL_MIME_TYPE,
	MS_POWERPOINT_MIME_TYPE,
	MS_WORD_MIME_TYPE,
	PDF_MIME_TYPE,
} from '@mantine/dropzone';
import { useDisclosure } from '@mantine/hooks';
import {
	IconCheck,
	IconEdit,
	IconFileTypePdf,
	IconLink,
} from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { taskWithBriefAndChatQueryOptions } from '@/back';
import { downloadPDF, Files, SimpleEditor } from '@/front';
import { Route } from '@/routes/_authed/tasks/$taskId';
import type { Task } from '@/types';
import { ScrollArea } from '~/ui';
import { DownloadFilesButton } from './DownloadFilesButton';
import { Edit } from './forms';

export const TaskPage = () => {
	const { taskId } = useParams({ from: Route.id });
	const { data: task } = useSuspenseQuery(
		taskWithBriefAndChatQueryOptions({ id: taskId, archived: false }),
	);
	const [isEditingOpened, { open: openEdit, close: closeEdit }] =
		useDisclosure(false);

	const [downloading, setDownloading] = useState<boolean>(false);
	const [currentTaskURL, setCurrentTaskURL] = useState<string>('');

	useEffect(() => {
		setCurrentTaskURL(`${location.origin}/task/${taskId.replace('task:', '')}`);
	}, [taskId]);

	return (
		<Stack pb="xl" pt="sm">
			<Group justify="space-between">
				<Group justify="flex-start" align="center">
					<Title>{task.title}</Title>
					<CopyButton value={currentTaskURL}>
						{({ copied, copy }) => (
							<Tooltip
								label="Сформировать ссылку"
								color="dark"
								position="bottom"
								offset={10}
								openDelay={100}
								closeDelay={100}
							>
								<ActionIcon variant="subtle" c="green" onClick={copy}>
									{copied ? <IconCheck size={16} /> : <IconLink size={16} />}
								</ActionIcon>
							</Tooltip>
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
						<Files.Root
							route="upload"
							api="/api/files/upload"
							taskId={taskId}
							fileTypes={[
								...IMAGE_MIME_TYPE,
								...PDF_MIME_TYPE,
								...MS_WORD_MIME_TYPE,
								...MS_EXCEL_MIME_TYPE,
								...MS_POWERPOINT_MIME_TYPE,
							]}
							maxFilesTotal={10}
							maxFilesPerUpload={10}
							maxFileSize={1024 * 1024 * 10}
						>
							{/*<Paper withBorder radius="md">*/}
							<Group justify="flex-start">
								<Title order={3}>Задание</Title>
							</Group>
							{/*</Paper>*/}
							<Paper withBorder radius="md">
								<ScrollArea h="calc(100vh - 200px)">
									<Stack px="md" pt="sm" h="calc(100vh - 200px)">
										<Box style={{ whiteSpace: 'pre-wrap' }}>
											<Text c="dimmed">Компания</Text>
											<Text>{task.company?.title}</Text>
										</Box>
										<Box style={{ whiteSpace: 'pre-wrap' }}>
											<Text c="dimmed">О компании</Text>
											<Text>{task.company?.info}</Text>
										</Box>
										<Box style={{ whiteSpace: 'pre-wrap' }}>
											<Text c="dimmed">Описание</Text>
											<Text>{task.content}</Text>
										</Box>

										<Files.Content mt="auto" pb="sm">
											<Files.List />
											<Files.Dropzone />
										</Files.Content>
									</Stack>

									<ScrollArea.ScrollButton />
								</ScrollArea>
							</Paper>
							<Group justify="flex-end">
								<DownloadFilesButton />
								<Button
									size="xs"
									leftSection={<IconEdit size={16} />}
									onClick={() => {
										openEdit();
									}}
								>
									Редактировать
								</Button>
							</Group>
						</Files.Root>
					</Stack>
				</Grid.Col>

				<Grid.Col span={8}>
					<Stack gap="xs">
						{/*<Paper withBorder radius="md">*/}
						<Group justify="flex-start">
							<Title order={3}>Бриф</Title>
						</Group>
						{/*</Paper>*/}

						<SimpleEditor
							height="calc(100vh - 200px)"
							initialContent={task.brief?.content}
							initialEditable={false}
							initialDisabledToolbar
						/>

						<Group justify="flex-end">
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
					</Stack>
				</Grid.Col>
			</Grid>
			<Edit
				task={task as unknown as Task}
				opened={isEditingOpened}
				onClose={closeEdit}
			/>
		</Stack>
	);
};
