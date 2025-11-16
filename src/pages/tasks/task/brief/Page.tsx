import { Grid, Group, Stack, Text, Title } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import {
	taskWithBriefQueryOptions,
	type UpdateBrief,
	updateBrief,
} from '@/api';
import { Chat, Editor } from '@/elements';
import { Route } from '@/routes/_authed/tasks/$taskId/brief';
import { BriefChat } from './Chat';
import { BriefEditor } from './Editor';

export const BriefPage = () => {
	const { taskId } = useParams({ from: Route.id });
	const { data: task } = useSuspenseQuery(taskWithBriefQueryOptions(taskId));

	const queryClient = useQueryClient();
	const { mutate, status } = useMutation({
		mutationFn: (briefData: UpdateBrief) =>
			updateBrief({ data: { briefData } }),
		onSettled: () =>
			queryClient.invalidateQueries({ queryKey: ['taskWithBrief'] }),
	});

	const debouncedUpdate = useDebouncedCallback(async (content: string) => {
		mutate({ id: task.brief.id, content });
	}, 500);

	return (
		<Chat.Provider
			initialModel={task.prompt.model.name}
			initialPrompt={task.prompt.content}
		>
			<Editor.Provider
				initialContent={task.brief.content}
				onChange={debouncedUpdate}
			>
				<Stack pb="xl" pt="sm">
					<Group justify="space-between">
						<Title>{task.title}</Title>
						<Text c="dimmed">
							Дата создания:{' '}
							<Text c="var(--mantine-color-text)" span>
								{task.time.created}
							</Text>
						</Text>
					</Group>

					<Grid gutter="xl" overflow="hidden">
						<Grid.Col span={3}>
							<BriefChat height="calc(100vh - 112px)" />
						</Grid.Col>

						<Grid.Col span={9}>
							<BriefEditor
								height="calc(100vh - 161px)"
								saving={status === 'pending'}
							/>
						</Grid.Col>
					</Grid>
				</Stack>
			</Editor.Provider>
		</Chat.Provider>
	);
};
