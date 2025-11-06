import tiptapCss from '@mantine/tiptap/styles.css?url';
import { createFileRoute } from '@tanstack/react-router';
import { promptQueryOptions } from '@/api';
import { PromptPage } from './-promptId';

export const Route = createFileRoute('/prompts/$promptId')({
	loader: async ({ context, params: { promptId } }) => {
		await context.queryClient.ensureQueryData(promptQueryOptions(promptId));
	},
	component: PromptPage,
	head: () => ({
		links: [
			{
				rel: 'stylesheet',
				href: tiptapCss,
			},
		],
	}),
});
