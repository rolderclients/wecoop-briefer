import { createFileRoute } from '@tanstack/react-router';
import {
  modelsQueryOptions,
  servicesPromptsQueryOptions,
  servicesQueryOptions,
} from '@/api/repositories';
import { Prompts } from './-Prompts';

export const Route = createFileRoute('/prompts')({
  loaderDeps: ({ search: { archived } }) => ({ archived }),
  loader: async ({ context, deps: { archived } }) => {
    await context.queryClient.ensureQueryData(servicesQueryOptions());
    await context.queryClient.ensureQueryData(modelsQueryOptions());
    await context.queryClient.ensureQueryData(
      servicesPromptsQueryOptions(archived),
    );
  },
  component: Prompts,
  validateSearch: (search: Record<string, unknown>): { archived?: boolean } => {
    return {
      archived: search?.archived === true ? true : undefined,
    };
  },
});
