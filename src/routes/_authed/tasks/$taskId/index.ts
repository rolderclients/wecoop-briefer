import tiptapCss from '@mantine/tiptap/styles.css?url';
import { createFileRoute } from '@tanstack/react-router';
import { taskWithBriefQueryOptions } from '@/api';
import { TaskPage } from '@/pages';

export const Route = createFileRoute('/_authed/tasks/$taskId/')({
	loader: async ({ context, params: { taskId } }) => {
		await context.queryClient.ensureQueryData(
			taskWithBriefQueryOptions(taskId),
		)
	},
	head: () => ({
		links: [
			{
				rel: 'stylesheet',
				href: tiptapCss,
			},
		],
	}),
	component: TaskPage,
});
