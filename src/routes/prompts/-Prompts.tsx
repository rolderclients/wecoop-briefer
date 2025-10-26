import { Stack } from '@mantine/core';
import { Page } from '@/components';
import { Panel } from './-Panel';
import { PromptsList } from './-PromptsList';
import { PromptsProvider } from './-PromptsProvider';

export const Prompts = () => {
  return (
    <PromptsProvider>
      <Page>
        <Stack>
          <Panel />
          <PromptsList />
        </Stack>
      </Page>
    </PromptsProvider>
  );
};
