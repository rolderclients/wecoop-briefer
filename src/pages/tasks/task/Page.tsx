import {
  Box,
  Button,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconEdit, IconFileTypePdf } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { taskWithBriefAndChatQueryOptions } from "@/back";
import { SimpleEditor } from "@/front";
import { Route } from "@/routes/_authed/tasks/$taskId";
import { ScrollArea } from "~/ui";
import { downloadPDFFromServer } from "@/components/reusables/functions";

export const TaskPage = () => {
  const { taskId } = useParams({ from: Route.id });
  const { data: task } = useSuspenseQuery(
    taskWithBriefAndChatQueryOptions(taskId),
  );

  return (
    <Stack pb="xl" pt="sm">
      <Group justify="space-between">
        <Title>{task.title}</Title>
        <Text c="dimmed">
          Дата создания:{" "}
          <Text c="var(--mantine-color-text)" span>
            {task.time.created}
          </Text>
        </Text>
      </Group>

      <Grid gutter="xl" overflow="hidden">
        <Grid.Col span={4}>
          <Stack gap="xs">
            <Title order={3}>Задание</Title>
            <Paper withBorder radius="md">
              <ScrollArea h="calc(100vh - 147px)">
                <Stack px="md" py="sm">
                  <Box style={{ whiteSpace: "pre-wrap" }}>
                    <Text c="dimmed">Компания</Text>
                    <Text>{task.company.title}</Text>
                  </Box>
                  <Box style={{ whiteSpace: "pre-wrap" }}>
                    <Text c="dimmed">О компании</Text>
                    <Text>{task.company.info}</Text>
                  </Box>
                  <Box style={{ whiteSpace: "pre-wrap" }}>
                    <Text c="dimmed">Описание</Text>
                    <Text>{task.content}</Text>
                  </Box>
                </Stack>

                <ScrollArea.ScrollButton />
              </ScrollArea>
            </Paper>
          </Stack>
        </Grid.Col>

        <Grid.Col span={8}>
          <Stack gap="xs">
            <Group justify="space-between">
              <Title order={3}>Бриф</Title>

              <Group>
                <Button
                  component="div"
                  size="xs"
                  color="green"
                  leftSection={<IconFileTypePdf size={16} />}
                  onClick={() => {
                    downloadPDFFromServer(task.brief, "brief.pdf");
                  }}
                >
                  Скачать PDF
                </Button>

                <Link
                  key={task.id}
                  to="/tasks/$taskId/brief"
                  params={{ taskId: task.id }}
                >
                  <Button
                    component="div"
                    size="xs"
                    leftSection={<IconEdit size={16} />}
                  >
                    Редактировать
                  </Button>
                </Link>
              </Group>
            </Group>

            <SimpleEditor
              height="calc(100vh - 147px)"
              initialContent={task.brief?.content}
              initialEditable={false}
              initialDisabledToolbar
            />
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
