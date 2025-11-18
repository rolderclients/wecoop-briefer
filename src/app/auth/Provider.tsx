import { useRouteContext } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { createContext, type ReactNode, useContext, useState } from 'react';
import {
	type LoginProps,
	type LoginResult,
	login,
	logout,
	type SecureUser,
} from '@/api';

type AuthContextType = {
	user?: SecureUser | null;
	authed: boolean;
	loading: boolean;
	login: (data: LoginProps) => LoginResult;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const loginFn = useServerFn(login);
	const logoutFn = useServerFn(logout);

	const { user } = useRouteContext({ from: '__root__' });

	const [loading, setLoading] = useState(false);

	return (
		<AuthContext.Provider
			value={{
				user,
				authed: Boolean(user),
				loading,
				login: async (data) => {
					setLoading(true);
					const result = await loginFn({ data });
					setLoading(false);
					return result;
				},
				logout: logoutFn,
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
