import { useRouteContext, useRouter } from '@tanstack/react-router';
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import { signIn, signOut, useSession } from './better';
import { authErrorNotification, type ParsedAuthError } from './error';
import type { User } from './types';

export interface SignInProps {
	username: string;
	password: string;
	redirectPath?: string;
}

type AuthContextType = {
	user?: User;
	loading: boolean;
	signIn: (data: SignInProps) => Promise<void>;
	signOut: () => Promise<void>;
	refetch: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const router = useRouter();
	const { user: initialUser } = useRouteContext({ from: '__root__' });
	const { data, isPending, isRefetching, refetch, error } = useSession();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(initialUser);

	useEffect(() => {
		setUser(data?.user as User);
	}, [data?.user]);

	useEffect(() => {
		if (isPending || isRefetching) setLoading(true);
		else setLoading(false);
	}, [isPending, isRefetching]);

	useEffect(() => {
		if (error) {
			const parsedError = error as ParsedAuthError;
			if (parsedError) {
				authErrorNotification(parsedError);
				signOut();
			}
		}
	}, [error]);

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				signIn: async ({ username, password, redirectPath: to }) => {
					setLoading(true);
					const { error } = await signIn.username({ username, password });
					const parsedError = error as ParsedAuthError;
					if (parsedError) authErrorNotification(parsedError);
					else router.navigate({ to: to || '/', replace: true });

					setTimeout(() => setLoading(false), 100);
				},
				signOut: async () => {
					setLoading(true);

					const { error } = await signOut();
					const parsedError = error as ParsedAuthError;
					if (parsedError) authErrorNotification(parsedError);
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
