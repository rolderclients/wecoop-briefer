import { createFileRoute } from '@tanstack/react-router';
import { taskWithBriefAndCommentsQueryOptions } from '@/back';
import { UnautorizedTaskPage } from '@/pages/task/Page';

export const Route = createFileRoute('/task/$taskId')({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(
			taskWithBriefAndCommentsQueryOptions(`task:${Route.id}`), // Так как решил в ссылке не показывать task: добавляем здесь
		);
	},
	component: UnautorizedTaskPage,
});
