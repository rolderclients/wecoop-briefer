import { useSession } from '@tanstack/react-start/server';
import type { User } from '../db';

export type AppSession = {
	user?: Omit<User, 'password' | 'notSecure'>;
	token?: string;
};

export const useAppSession = () => {
	return useSession<AppSession>({
		name: 'app-session',
		password: process.env.SESSION_SECRET || '',
		cookie: {
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			httpOnly: true,
		},
	});
};
