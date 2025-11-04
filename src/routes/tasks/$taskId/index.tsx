import tiptapCss from '@mantine/tiptap/styles.css?url';
import { createFileRoute } from '@tanstack/react-router';
import { taskWithBriefQueryOptions } from '@/api';
import { TaskPage } from './-TaskPage';

export const Route = createFileRoute('/tasks/$taskId/')({
	loader: async ({ context, params: { taskId } }) => {
		await context.queryClient.ensureQueryData(
			taskWithBriefQueryOptions(taskId),
		);
	},
	component: TaskPage,
	head: () => ({
		links: [
			{
				rel: 'stylesheet',
				href: tiptapCss,
			},
		],
	}),
});
