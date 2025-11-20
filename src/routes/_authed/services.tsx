import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/services')({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_authed/services"!</div>;
}
