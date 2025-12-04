import dropzoneCss from '@mantine/dropzone/styles.css?url';
import tiptapCss from '@mantine/tiptap/styles.css?url';
import { createFileRoute } from '@tanstack/react-router';
import { taskWithBriefAndChatQueryOptions } from '@/back';
import { TaskPage } from '@/pages';

export const Route = createFileRoute('/_authed/tasks/$taskId/')({
	loader: async ({ context, params: { taskId } }) => {
		await context.queryClient.ensureQueryData(
			taskWithBriefAndChatQueryOptions({ id: taskId, archived: false }),
		);
	},
	head: () => ({
		links: [
			{
				rel: 'stylesheet',
				href: tiptapCss,
			},
			{
				rel: 'stylesheet',
				href: dropzoneCss,
			},
		],
	}),
	component: TaskPage,
});
