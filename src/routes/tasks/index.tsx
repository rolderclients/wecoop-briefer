import { createFileRoute } from '@tanstack/react-router';
import { tasksQueryOptions } from '@/api';
import { TasksPage } from './-index';

export const Route = createFileRoute('/tasks/')({
	loaderDeps: ({ search: { archived } }) => ({ archived }),
	loader: async ({ context, deps: { archived } }) => {
		await context.queryClient.ensureQueryData(tasksQueryOptions(archived));
	},
	component: TasksPage,
	validateSearch: (search: Record<string, unknown>): { archived?: boolean } => {
		return {
			archived: search?.archived === true ? true : undefined,
		};
	},
});
