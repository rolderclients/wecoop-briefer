import { Grid, Stack } from '@mantine/core';
import { Page } from '@/components';
import { TasksList } from './TasksList';
import { TasksProvider } from './TasksProvider';

export const TasksPage = () => (
  <TasksProvider>
    <Page>
      <Stack>
        <Grid px="md" c="dimmed">
          <Grid.Col span="auto">Название</Grid.Col>
        </Grid>

        <TasksList />
      </Stack>
    </Page>
  </TasksProvider>
);
