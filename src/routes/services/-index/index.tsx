import { Stack } from '@mantine/core';
import { Page } from '@/components';
import { Categories } from './Categories';
import { Panel } from './Panel';
import { ServicesProvider } from './ServicesProvider';

export const ServicesPage = () => (
  <ServicesProvider>
    <Page>
      <Stack>
        <Panel />
        <Categories />
      </Stack>
    </Page>
  </ServicesProvider>
);
