import { Stack, Title } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { promptQueryOptions, type UpdatePrompt, updatePrompt } from '@/api';
import { SimpleEditor } from '@/elements';

export const PromptPage = () => {
	const { promptId } = useParams({ from: '/prompts/$promptId' });

	const { data: prompt } = useSuspenseQuery(promptQueryOptions(promptId));

	const queryClient = useQueryClient();
	const { mutate, status } = useMutation({
		mutationFn: (promptData: UpdatePrompt) =>
			updatePrompt({ data: { promptData } }),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['prompt'] }),
	});

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
