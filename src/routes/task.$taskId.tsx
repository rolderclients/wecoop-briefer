import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/task/$taskId')({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/task/$taskId"!</div>;
}
