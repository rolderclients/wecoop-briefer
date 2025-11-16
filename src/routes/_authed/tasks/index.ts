import { createFileRoute } from '@tanstack/react-router';
import { tasksQueryOptions } from '@/api';
import { TasksPage } from '@/pages';

export const Route = createFileRoute('/_authed/tasks/')({
	loaderDeps: ({ search: { archived } }) => ({ archived }),
	loader: async ({ context, deps: { archived } }) => {
		await context.queryClient.ensureQueryData(tasksQueryOptions(archived));
	},
	validateSearch: (search: Record<string, unknown>): { archived?: boolean } => {
		return {
			archived: search?.archived === true ? true : undefined,
		}
	},
	component: TasksPage,
});
