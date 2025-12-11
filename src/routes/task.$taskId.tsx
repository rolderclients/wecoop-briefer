import tiptapCss from '@mantine/tiptap/styles.css?url';
import { createFileRoute } from '@tanstack/react-router';
import { taskWithBriefAndCommentsQueryOptions } from '@/back';
import { UnautorizedTaskPage } from '@/pages/task/Page';

export const Route = createFileRoute('/task/$taskId')({
	loader: async ({ context, params: { taskId } }) => {
		await context.queryClient.ensureQueryData(
			taskWithBriefAndCommentsQueryOptions(taskId),
		);
	},
	head: () => ({
		links: [
			{
				rel: 'stylesheet',
				href: tiptapCss,
			},
		],
	}),
	component: UnautorizedTaskPage,
});
