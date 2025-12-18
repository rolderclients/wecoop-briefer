import { useRouteContext, useRouter } from '@tanstack/react-router';
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import { signIn, signOut, useSession } from './better';
import { authErrorNotification } from './error';
import type { User } from './types';

export interface SignInProps {
	username: string;
	password: string;
	redirectPath?: string;
}

type AuthContextType = {
	user?: User;
	authed: boolean;
	loading: boolean;
	signIn: (data: SignInProps) => Promise<void>;
	signOut: () => Promise<void>;
	refetch: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const router = useRouter();
	// Используем только серверное состояние, чтобы рендеринг не зависил от useSession
	const { user } = useRouteContext({ from: '__root__' });
	const { isPending, isRefetching, refetch, error } = useSession();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (isPending || isRefetching) setLoading(true);
		else setLoading(false);
	}, [isPending, isRefetching]);

	useEffect(() => {
		if (error) authErrorNotification(error);
	}, [error]);

	return (
		<AuthContext.Provider
			value={{
				user,
				authed: Boolean(user) || !!user?.banned,
				loading,
				signIn: async ({ username, password, redirectPath: to }) => {
					setLoading(true);
					const { error } = await signIn.username({
						username,
						password,
					});

					if (error) authErrorNotification(error);
					else
						router.navigate({
							to: to || '/',
							replace: true,
							reloadDocument: true,
						});

					setTimeout(() => setLoading(false), 100);
				},
				signOut: async () => {
					setLoading(true);

					const { error } = await signOut();
					if (error) authErrorNotification(error);
					else router.navigate({ to: '/auth/signin', replace: true });

					setTimeout(() => setLoading(false), 100);
				},
				refetch: () => refetch({ query: { disableCookieCache: true } }),
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
};
