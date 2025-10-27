import { createFileRoute } from '@tanstack/react-router';
import { categoriesQueryOptions, servicesQueryOptions } from '@/api';
import { Services } from './-components/Services';

export const Route = createFileRoute('/services')({
  loaderDeps: ({ search: { archived } }) => ({ archived }),
  loader: async ({ context, deps: { archived } }) => {
    await context.queryClient.ensureQueryData(servicesQueryOptions(archived));
    await context.queryClient.ensureQueryData(categoriesQueryOptions());
  },
  component: Services,
  validateSearch: (search: Record<string, unknown>): { archived?: boolean } => {
    return {
      archived: search?.archived === true ? true : undefined,
    };
  },
});
