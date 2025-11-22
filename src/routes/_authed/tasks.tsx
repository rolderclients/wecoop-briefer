import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/tasks')({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_authed/tasks"!</div>;
}
