import { Grid, Group, Stack, Text, Title } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import {
	taskWithBriefQueryOptions,
	type UpdateBrief,
	updateBrief,
} from '@/api';
import { AIEditor, ChatConversation } from '@/components';
import { Route } from '.';

export const BriefPage = () => {
	const { taskId } = useParams({ from: Route.id });
	const { data: task } = useSuspenseQuery(taskWithBriefQueryOptions(taskId));

	const { mutate, status } = useMutation({
		mutationFn: (briefData: UpdateBrief) =>
			updateBrief({ data: { briefData } }),
	});

	const debouncedUpdate = useDebouncedCallback(async (content: string) => {
		mutate({ id: task.brief.id, content });
	}, 500);

	return (
		<Stack pb="xl" pt="lg">
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
					<ChatConversation
						h="calc(100vh - 112px)"
						model={task.prompt.model.name}
						prompt={task.prompt.content}
					/>
				</Grid.Col>

				<Grid.Col span={9}>
					<AIEditor
						content={task.brief?.content}
						editable={!task.archived}
						saving={status === 'pending'}
						onChange={debouncedUpdate}
						height="calc(100vh - 161px)"
					/>
				</Grid.Col>
			</Grid>
		</Stack>
	);
};
