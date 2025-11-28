import { Stack, Title } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { promptQueryOptions, updatePromptFn } from '@/back';
import { SimpleEditor, useMutaitionWithInvalidate } from '@/front';
import { Route } from '@/routes/_authed/prompts/$promptId';
import type { UpdatePrompt } from '@/types';

export const PromptPage = () => {
	const { promptId } = useParams({ from: Route.id });

	const { data: prompt } = useSuspenseQuery(promptQueryOptions(promptId));
	const { mutate, status } = useMutaitionWithInvalidate<UpdatePrompt>(
		updatePromptFn,
		['prompt', promptId],
	);

	const debouncedUpdate = useDebouncedCallback(
		async (content: string) => mutate({ id: prompt.id, content }),
		500,
	);

	return (
		<Stack pb="xl" pt="lg">
			<Title>{prompt.title}</Title>

			<SimpleEditor
				initialContent={prompt.content}
				onChange={debouncedUpdate}
				saving={status === 'pending'}
			/>
		</Stack>
	);
};
