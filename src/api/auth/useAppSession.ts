import { useSession } from '@tanstack/react-start/server';
import type { SecureUser } from '../db';

export type AppSession = {
	user?: SecureUser;
};

export const useAppSession = () => {
	return useSession<AppSession>({
		name: 'app-session',
		password: process.env.SESSION_SECRET || '',
		cookie: {
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			httpOnly: true,
			path: '/',
		},
	});
};
