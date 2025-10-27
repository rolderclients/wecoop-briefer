import { Stack } from '@mantine/core';
import { Page } from '@/components';
import { Panel } from './Panel';
import { PromptsProvider } from './PromptsProvider';
import { Services } from './Services';

export const Prompts = () => {
  return (
    <PromptsProvider>
      <Page>
        <Stack>
          <Panel />
          <Services />
        </Stack>
      </Page>
    </PromptsProvider>
  );
};
