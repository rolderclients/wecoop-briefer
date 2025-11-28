import { createFileRoute } from '@tanstack/react-router';
import {
	modelsQueryOptions,
	servicesQueryOptions,
	servicesWithPromptsQueryOptions,
} from '@/back';
import { PromptsPage } from '@/pages';

export const Route = createFileRoute('/_authed/prompts/')({
	loaderDeps: ({ search: { archived } }) => ({ archived }),
	loader: async ({ context, deps: { archived } }) => {
		await context.queryClient.ensureQueryData(servicesQueryOptions());
		await context.queryClient.ensureQueryData(modelsQueryOptions());
		await context.queryClient.ensureQueryData(
			servicesWithPromptsQueryOptions(archived),
		);
	},
	validateSearch: (search: Record<string, unknown>): { archived?: boolean } => {
		return {
			archived: search?.archived === true ? true : undefined,
		};
	},
	component: PromptsPage,
});
