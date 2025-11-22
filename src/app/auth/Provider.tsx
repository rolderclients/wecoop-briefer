import { useRouteContext, useRouter } from '@tanstack/react-router';
import type { UserWithRole } from 'better-auth/plugins';
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import { signIn, signOut, useSession } from './client';
import type { AuthError } from './error';

export interface SignInProps {
	username: string;
	password: string;
	redirect?: string;
}

type AuthContextType = {
	user?: UserWithRole;
	authed: boolean;
	loading: boolean;
	signIn: (data: SignInProps) => Promise<AuthError>;
	signOut: () => Promise<AuthError>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const router = useRouter();
	const { user: initialUser } = useRouteContext({ from: '__root__' });
	const { data, isPending, isRefetching } = useSession();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (isPending || isRefetching) setLoading(true);
		else setLoading(false);
	}, [isPending, isRefetching]);

	return (
		<AuthContext.Provider
			value={{
				user: (data?.user as UserWithRole) || initialUser,
				authed: Boolean((data?.user as UserWithRole) || initialUser),
				loading,
				signIn: async ({ username, password, redirect: to }) => {
					setLoading(true);
					const { error } = await signIn.username({ username, password });
					if (!error && to) router.navigate({ to, replace: true });
					setTimeout(() => setLoading(false), 100);
					return error;
				},
				signOut: async () => {
					setLoading(true);
					const { error } = await signOut();
					setTimeout(() => {
						setLoading(false);
						router.invalidate({ sync: true });
					}, 100);
					return error;
				},
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
