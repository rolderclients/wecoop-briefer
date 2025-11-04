import { Grid, Group, Stack, Text, Title } from '@mantine/core';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { taskWithBriefQueryOptions } from '@/api';
import { AIEditor, ChatConversation, ChatProvider } from '@/components';
import { Route } from '.';

export const BriefPage = () => {
	const { taskId } = useParams({ from: Route.id });
	const { data: task } = useSuspenseQuery(taskWithBriefQueryOptions(taskId));

	return (
		<ChatProvider>
			<Stack pb="xl" pt="lg">
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
						<ChatConversation h="calc(100vh - 124px)" />
					</Grid.Col>

					<Grid.Col span={8}>
						<AIEditor
							content={task.brief?.content}
							editable={!task.archived}
							height="calc(100vh - 173px)"
						/>
					</Grid.Col>
				</Grid>
			</Stack>
		</ChatProvider>
	);
};
