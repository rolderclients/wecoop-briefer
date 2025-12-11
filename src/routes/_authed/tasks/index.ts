import { createFileRoute } from '@tanstack/react-router';
import {
	servicesWithEnbledPromptsQueryOptions,
	tasksQueryOptions,
} from '@/back';
import { TasksPage } from '@/pages';

export const Route = createFileRoute('/_authed/tasks/')({
	loaderDeps: ({ search: { archived, searchString } }) => ({
		archived: !!archived,
		searchString,
	}),
	loader: async ({ context, deps: { archived, searchString } }) => {
		await context.queryClient.ensureQueryData(
			tasksQueryOptions(archived, searchString),
		);
		await context.queryClient.ensureQueryData(
			servicesWithEnbledPromptsQueryOptions(),
		);
	},
	validateSearch: (
		search: Record<string, unknown>,
	): { archived?: boolean; searchString?: string } => {
		return {
			archived: search?.archived === true ? true : undefined,
			searchString:
				typeof search?.searchString === 'string' && search?.searchString
					? search?.searchString
					: undefined,
		};
	},
	component: TasksPage,
});
