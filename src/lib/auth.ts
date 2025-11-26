import { betterAuth } from 'better-auth';
import { admin, username as usernamePlugin } from 'better-auth/plugins';
import { getDB } from '@/api';
import { roles } from '@/app/auth/better';
import { surrealAdapter } from './authDbAdapter/adapter';

const db = await getDB();

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		admin({
			roles,
			bannedUserMessage:
				'Доступ к приложению заблокирован. Обратитесь к администратору.',
		}),
		usernamePlugin(),
	],
	database: surrealAdapter(db),
	user: {
		changeEmail: {
			enabled: true,
			updateEmailWithoutVerification: true,
		},
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60,
		},
	},
});

export type Session = typeof auth.$Infer.Session;
