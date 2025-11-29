import { Grid, Group, Stack, Text, Title } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { taskWithBriefAndChatQueryOptions, updateBriefFn } from '@/back';
import { Chat, useMutaitionWithInvalidate } from '@/front';
import { Route } from '@/routes/_authed/tasks/$taskId/brief';
import type { UpdateBrief } from '@/types';
import { Editor } from '~/ui';
import { BriefChat, BriefEditor } from './components';

export const BriefPage = () => {
	const { taskId } = useParams({ from: Route.id });
	const { data: task } = useSuspenseQuery(
		taskWithBriefAndChatQueryOptions(taskId),
	);

	const { mutate, status } = useMutaitionWithInvalidate<UpdateBrief>(
		updateBriefFn,
		['taskWithBriefAndChat', taskId],
	);

	const debouncedUpdate = useDebouncedCallback(async (content: string) => {
		mutate({ id: task.brief.id, content });
	}, 500);

	return (
		<Chat.Provider
			chatId={task.chat.id}
			initialModel={task.prompt?.model}
			initialPrompt={task.prompt?.content}
			initialMessages={task.chat.messages}
			initialDisabled={!task.prompt}
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
