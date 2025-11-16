import { useSession } from '@tanstack/react-start/server';
import type { SecuredUser } from '../db';

export const useAppSession = () => {
	return useSession<SecuredUser>({
		name: 'app-session',
		password: process.env.SESSION_SECRET || '',
		// Optional: customize cookie settings
		// cookie: {
		// 	secure: process.env.NODE_ENV === 'production',
		// 	sameSite: 'lax',
		// 	httpOnly: true,
		// },
	});
};
