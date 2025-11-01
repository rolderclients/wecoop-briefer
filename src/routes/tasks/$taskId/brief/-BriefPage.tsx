import { useChat } from '@ai-sdk/react';
import { Grid, Group, Stack, Text, Title } from '@mantine/core';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { taskWithBriefQueryOptions } from '@/api';
import { AIEditor, ChatMessage, Page } from '@/components';
import { Conversation, ScrollArea } from '@/components/kit';
import type { AgentUIMessage } from '@/routes/api/chat';
import { Route } from '.';

export const BriefPage = () => {
  const { taskId } = useParams({ from: Route.id });
  const { data: task } = useSuspenseQuery(taskWithBriefQueryOptions(taskId));
  const { messages, sendMessage, status } = useChat<AgentUIMessage>();
  const [input, setInput] = useState('');

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
              <Conversation>
                <ScrollArea h="calc(100vh - 240px)" autoScrollOnInitialRender>
                  <ScrollArea.Content>
                    {!messages.length && <Conversation.EmptyState />}

                    <Stack gap="sm" p="md">
                      {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                      ))}
                    </Stack>
                  </ScrollArea.Content>
                  <ScrollArea.ScrollButton />
                </ScrollArea>
              </Conversation>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (input.trim()) {
                    sendMessage({ text: input });
                    setInput('');
                  }
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={status !== 'ready'}
                  placeholder="Say something..."
                />
                <button type="submit" disabled={status !== 'ready'}>
                  Submit
                </button>
              </form>
            </Stack>
          </Grid.Col>

          <Grid.Col span={8}>
            <AIEditor
              content={task.brief?.content}
              messages={messages}
              editable={!task.archived || status !== 'ready'}
              height="calc(100vh - 240px)"
            />
          </Grid.Col>
        </Grid>
      </Stack>
    </Page>
  );
};
