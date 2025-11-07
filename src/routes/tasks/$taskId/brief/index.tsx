import tiptapCss from '@mantine/tiptap/styles.css?url';
import { createFileRoute } from '@tanstack/react-router';
import { taskWithBriefQueryOptions } from '@/api';
import { ChatProvider } from '@/components';
import { BriefPage } from './-BriefPage';

export const Route = createFileRoute('/tasks/$taskId/brief/')({
	loader: async ({ context, params: { taskId } }) => {
		await context.queryClient.ensureQueryData(
			taskWithBriefQueryOptions(taskId),
		);
	},
	component: () => (
		<ChatProvider>
			<BriefPage />
		</ChatProvider>
	),
	head: () => ({
		links: [
			{
				rel: 'stylesheet',
				href: tiptapCss,
			},
		],
	}),
});
