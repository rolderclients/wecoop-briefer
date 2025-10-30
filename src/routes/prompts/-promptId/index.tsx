import { Stack, Title } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { promptQueryOptions, type UpdatePrompt, updatePrompt } from '@/api';
import { Page } from '@/components';
import { Route } from '../$promptId';
import { Editor } from './Editor';

export const PromptPage = () => {
  const { promptId } = useParams({ from: Route.fullPath });
  const { data: prompt, isLoading } = useSuspenseQuery(
    promptQueryOptions(promptId),
  );

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

  console.log(prompt.title);

  return (
    <Page>
      <Stack>
        <Title>{prompt.title}</Title>

        {isLoading ? null : (
          <Editor
            prompt={prompt}
            onChange={debouncedUpdate}
            saving={status === 'pending'}
          />
        )}
      </Stack>
    </Page>
  );
};
