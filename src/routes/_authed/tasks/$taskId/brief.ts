import tiptapCss from '@mantine/tiptap/styles.css?url';
import { createFileRoute } from '@tanstack/react-router';
import { taskWithBriefAndChatQueryOptions } from '@/back';
import { BriefPage } from '@/pages';

export const Route = createFileRoute('/_authed/tasks/$taskId/brief')({
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
		],
	}),
	component: BriefPage,
});
