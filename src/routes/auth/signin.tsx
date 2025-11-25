import { createFileRoute } from '@tanstack/react-router';
import { SignIn } from '@/app';

export const Route = createFileRoute('/auth/signin')({
	loaderDeps: ({ search: { redirectPath } }) => ({ redirectPath }),
	validateSearch: (
		search: Record<string, unknown>,
	): { redirectPath?: string } => {
		return {
			redirectPath: search?.redirectPath as string,
		};
	},
	component: SignIn,
});
