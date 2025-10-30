import { createFileRoute } from '@tanstack/react-router';
import {
  categoriesQueryOptions,
  categoriesWithServicesQueryOptions,
} from '@/api';
import { ServicesPage } from './-index';

export const Route = createFileRoute('/services/')({
  loaderDeps: ({ search: { archived } }) => ({ archived }),
  loader: async ({ context, deps: { archived } }) => {
    await context.queryClient.ensureQueryData(categoriesQueryOptions());
    await context.queryClient.ensureQueryData(
      categoriesWithServicesQueryOptions(archived),
    );
  },
  component: ServicesPage,
  validateSearch: (search: Record<string, unknown>): { archived?: boolean } => {
    return {
      archived: search?.archived === true ? true : undefined,
    };
  },
});
