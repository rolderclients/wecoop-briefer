import { useChat } from '@ai-sdk/react';
import { Grid, Group, Stack, Text, Title } from '@mantine/core';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { taskWithBriefQueryOptions } from '@/api';
import { AIEditor, ChatMessage, Page } from '@/components';
import { Conversation, PromptInput } from '@/components/kit';
import type { AgentUIMessage } from '@/routes/api/chat';
import { Route } from '.';

export const BriefPage = () => {
  const { taskId } = useParams({ from: Route.id });
  const { data: task } = useSuspenseQuery(taskWithBriefQueryOptions(taskId));
  const { messages, sendMessage, status } = useChat<AgentUIMessage>();

  return (
    <Page>
      <Stack>
        <Group justify="space-between" align="flex-start">
          <Title>{task.title}</Title>
          <Text c="dimmed">
            Дата создания:{' '}
            <Text c="var(--mantine-color-text)" span>
              {new Date(task.time.created).toLocaleDateString('ru-RU', {
                hour: 'numeric',
                minute: 'numeric',
              })}
            </Text>
          </Text>
        </Group>

        <Grid gutter="xl">
          <Grid.Col span={4}>
            <Stack>
              <Conversation height="calc(100vh - 646px)">
                {!messages.length && <Conversation.EmptyState />}

                <Stack gap="sm" p="md">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                </Stack>
              </Conversation>

              <PromptInput
                radius="md"
                onSubmit={(v) => {
                  console.log(v);
                }}
              >
                <PromptInput.Input />
                <PromptInput.Toolbar>
                  <PromptInput.SendButton />
                </PromptInput.Toolbar>
              </PromptInput>
            </Stack>
          </Grid.Col>

          <Grid.Col span={8}>
            <AIEditor
              content={task.brief?.content}
              messages={messages}
              editable={!task.archived || status !== 'ready'}
              height="calc(100vh - 237px)"
            />
          </Grid.Col>
        </Grid>
      </Stack>
    </Page>
  );
};
