import { Group, Stack, Text, Title } from '@mantine/core';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { taskWithBriefQueryOptions } from '@/api';
import { Page } from '@/components';
import { Route } from '../$taskId';

export const TaskPage = () => {
  const { taskId } = useParams({ from: Route.fullPath });
  const { data: task } = useSuspenseQuery(taskWithBriefQueryOptions(taskId));

  // console.log(task);

  return (
    <Page>
      <Stack>
        <Group justify="space-between">
          <Title>{task.title}</Title>
          <Text>TEST</Text>
        </Group>
      </Stack>
    </Page>
  );
};
