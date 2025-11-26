import tiptapCss from '@mantine/tiptap/styles.css?url';
import { createFileRoute } from '@tanstack/react-router';
import { promptQueryOptions } from '@/api';
import { PromptPage } from '@/pages';

export const Route = createFileRoute('/_authed/prompts/$promptId')({
	loader: async ({ context, params: { promptId } }) => {
		await context.queryClient.ensureQueryData(promptQueryOptions(promptId));
	},
	head: () => ({
		links: [
			{
				rel: 'stylesheet',
				href: tiptapCss,
			},
		],
	}),
	component: PromptPage,
});
