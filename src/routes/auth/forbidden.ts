import { createFileRoute } from '@tanstack/react-router';
import { Forbidden } from '@/front';

export const Route = createFileRoute('/auth/forbidden')({
	component: Forbidden,
});
