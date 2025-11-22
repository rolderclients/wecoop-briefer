import { createFileRoute } from '@tanstack/react-router';
import { Login } from '@/app';

export const Route = createFileRoute('/auth/login')({
	loaderDeps: ({ search: { redirect } }) => ({ redirect }),
	validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
		return {
			redirect: search?.redirect as string,
		};
	},
	component: Login,
});
