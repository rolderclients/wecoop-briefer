import { createFileRoute } from '@tanstack/react-router';
import {
	modelsQueryOptions,
	servicesQueryOptions,
	servicesWithPromptsQueryOptions,
} from '@/api/repositories';
import { PromptsPage } from './-index';

export const Route = createFileRoute('/prompts/')({
	loaderDeps: ({ search: { archived } }) => ({ archived }),
	loader: async ({ context, deps: { archived } }) => {
		await context.queryClient.ensureQueryData(servicesQueryOptions());
		await context.queryClient.ensureQueryData(modelsQueryOptions());
		await context.queryClient.ensureQueryData(
			servicesWithPromptsQueryOptions(archived),
		);
	},
	component: PromptsPage,
	validateSearch: (search: Record<string, unknown>): { archived?: boolean } => {
		return {
			archived: search?.archived === true ? true : undefined,
		};
	},
});
