import { createFileRoute } from '@tanstack/react-router';
import { commentsQueryOptions } from '@/back/db/repositories/comment';
import { UnautorizedTaskPage } from '@/pages/task/Page';

export const Route = createFileRoute('/task/$taskId')({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(
			commentsQueryOptions({ taskId: `task:${Route.id}` }), // Так как решил в ссылке не показывать task: добавляем здесь
		);
	},
	component: UnautorizedTaskPage,
});
