import { Group, Space, Stack, Text } from '@mantine/core';
import { Page } from '@/components';
import { Panel } from './-Panel';
import { ServiceList } from './-ServiceList';
import { ServicesProvider } from './-ServicesProvider';

export const Services = () => (
  <ServicesProvider>
    <Page>
      <Stack>
        <Panel />

        <Group px="md" c="dimmed" wrap="nowrap">
          <Space w={20} />
          <Text w="47%">Название</Text>
          <Text w="47%">Категория</Text>
        </Group>

        <ServiceList />
      </Stack>
    </Page>
  </ServicesProvider>
);
