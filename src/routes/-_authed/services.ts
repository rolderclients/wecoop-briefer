import { createFileRoute } from '@tanstack/react-router';
import {
	categoriesQueryOptions,
	categoriesWithServicesQueryOptions,
} from '@/api';
import { ServicesPage } from '@/pages';

export const Route = createFileRoute('/_authed/services')({
	loaderDeps: ({ search: { archived } }) => ({ archived }),
	loader: async ({ context, deps: { archived } }) => {
		await context.queryClient.ensureQueryData(categoriesQueryOptions());
		await context.queryClient.ensureQueryData(
			categoriesWithServicesQueryOptions(archived),
		);
	},
	validateSearch: (search: Record<string, unknown>): { archived?: boolean } => {
		return {
			archived: search?.archived === true ? true : undefined,
		};
	},
	component: ServicesPage,
});
