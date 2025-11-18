import { createFileRoute } from '@tanstack/react-router';
import { Forbidden } from '@/app';

export const Route = createFileRoute('/forbidden')({
	component: Forbidden,
});
