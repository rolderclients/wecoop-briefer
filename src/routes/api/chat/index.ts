import type { AnthropicProviderOptions } from '@ai-sdk/anthropic';
import { createFileRoute } from '@tanstack/react-router';
import {
  createAgentUIStreamResponse,
  type InferAgentUIMessage,
  Output,
  ToolLoopAgent,
  type UIMessage,
} from 'ai';
import { object, type output, string } from 'zod/v4';

const providerOptions = {
  anthropic: {
    thinking: { type: 'disabled' },
  } satisfies AnthropicProviderOptions,
};

const schema = object({
  document: string().describe('Документ в формате HTML'),
  chat: string().describe('Сообщения в чат для пользователя'),
});

export type StructuredTextPart = output<typeof schema>;

const agent = new ToolLoopAgent({
  model: 'openai/gpt-4o',
  providerOptions,
  instructions: 'Создавай или изменяй документ только по просьбе пользователя',
  output: Output.object({ schema }),
});

export type AgentUIMessage = InferAgentUIMessage<typeof agent>;

export const Route = createFileRoute('/api/chat/')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages }: { messages: UIMessage[] } = await request.json();

        return createAgentUIStreamResponse({ agent, messages });
      },
    },
  },
});
