import { createFileRoute } from '@tanstack/react-router';
import { UnautorizedTaskPage } from '@/pages/task/Page';

export const Route = createFileRoute('/task/$taskId')({
	component: UnautorizedTaskPage,
});
