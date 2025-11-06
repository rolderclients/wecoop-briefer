import { Stack, Title } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { promptQueryOptions, type UpdatePrompt, updatePrompt } from '@/api';
import { Editor } from '@/components';
import { Route } from '../$promptId';

export const PromptPage = () => {
	const { promptId } = useParams({ from: Route.fullPath });
	const { data: prompt } = useSuspenseQuery(promptQueryOptions(promptId));

	const { mutate, status } = useMutation({
		mutationFn: (promptData: UpdatePrompt) =>
			updatePrompt({ data: { promptData } }),
	});

	const debouncedUpdate = useDebouncedCallback(
		async (content: string) => mutate({ id: prompt.id, content }),
		500,
	);

	return (
		<Stack pb="xl" pt="lg">
			<Title>{prompt.title}</Title>

			<Editor
				content={prompt.content}
				onChange={debouncedUpdate}
				saving={status === 'pending'}
				editable={!prompt.archived}
			/>
		</Stack>
	);
};
