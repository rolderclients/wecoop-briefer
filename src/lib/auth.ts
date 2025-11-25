import { APIError, betterAuth } from 'better-auth';
import {
	admin,
	createAuthMiddleware,
	username as usernamePlugin,
} from 'better-auth/plugins';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { surql } from 'surrealdb';
import { getDB, getDBFn } from '@/api';
import { type AuthErrorCodes, parseAuthError } from '@/app';
import { roles } from '@/app/auth/better';
import { surrealAdapter } from './authDbAdapter/adapter';

const username = process.env.AUTH_ROOT_USERNAME;
const password = process.env.AUTH_ROOT_PASSWORD;

if (!username || !password) {
	throw new Error(
		'Missing AUTH_ROOT_USERNAME or AUTH_ROOT_PASSWORD environment variables',
	);
}

const dbInstance = await getDBFn();
const db = await dbInstance.newSession();
await db.use({
	namespace: dbInstance.namespace,
	database: dbInstance.database,
});

await db.signin({
	access: 'user',
	variables: { username, password },
});

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
		password: {
			hash: async (password) => {
				const [hash] = await db
					.query(surql`crypto::argon2::generate(${password})`)
					.collect<string[]>();

				return hash;
			},
			verify: async () => true,
		},
	},
	plugins: [
		admin({
			roles,
			bannedUserMessage:
				'Доступ к приложению заблокирован. Обратитесь к администратору.',
		}),
		usernamePlugin(),
		tanstackStartCookies(),
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
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			// console.log('before', ctx.path);

			// try {
			// 	if (ctx.path === '/sign-in/username') {
			// 		const sessionId = ctx.context.newSession?.session.id;
			// 		const db = await getDB(sessionId);
			// 		const { username, password } = ctx.body;
			// 		await db.signin({
			// 			access: 'user',
			// 			variables: { username, password },
			// 		});
			// 	}
			// } catch (error) {
			// 	console.error('inner', error);
			// 	const message = (error as Error).message;
			// 	const code = message.split('An error occurred: ')[1] as AuthErrorCodes;
			// 	throw new APIError('UNAUTHORIZED', parseAuthError(code, message));
			// }
			// const invalidateSession = async () => {
			// 	const dbSession = await getDB(ctx.body.userId);
			// 	await dbSession.invalidate();
			// };

			try {
				// if (ctx.path === '/sign-out') {
				// 	const db = await getDB();
				// 	await db.invalidate();
				// }
				// if (ctx.path === '/admin/set-user-password') await invalidateSession();
				// if (ctx.path === '/admin/set-role') await invalidateSession();
				// if (ctx.path === '/admin/ban-user') await invalidateSession();
				// if (ctx.path === '/admin/remove-user') await invalidateSession();
			} catch (error) {
				// const message = (error as Error).message;
				// const code = message.split('An error occurred: ')[1] as AuthErrorCodes;
				// throw new APIError('UNAUTHORIZED', parseAuthError(code, message));
			}
		}),
		after: createAuthMiddleware(async (ctx) => {
			if (ctx.path === '/get-session') {
				const sessionId = ctx.context.session?.session.id;
				if (sessionId) {
					const db = await getDB(sessionId);
					if (!db.accessToken) {
						throw new APIError(
							'UNAUTHORIZED',
							parseAuthError('DB_UNAUTHORIZED', 'Сессия БД не авторизована'),
						);
					}
				}
			}

			try {
				if (ctx.path === '/sign-in/username') {
					const sessionId = ctx.context.newSession?.session.id;
					const db = await getDB(sessionId);
					const { username, password } = ctx.body;
					await db.signin({
						access: 'user',
						variables: { username, password },
					});
				}
			} catch (error) {
				const message = (error as Error).message;
				const code = message.split('An error occurred: ')[1] as AuthErrorCodes;
				throw new APIError('UNAUTHORIZED', parseAuthError(code, message));
			}
		}),
	},
});

export type Session = typeof auth.$Infer.Session;
