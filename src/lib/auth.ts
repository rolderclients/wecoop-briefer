import { APIError, betterAuth } from 'better-auth';
import {
	admin,
	createAuthMiddleware,
	username as usernamePlugin,
} from 'better-auth/plugins';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { surql } from 'surrealdb';
import { getDB, getDBFn } from '@/api';
import { type AuthErrorCodes, ac, parseAuthError, roles } from '@/app';
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
	plugins: [tanstackStartCookies(), admin({ ac, roles }), usernamePlugin()],
	database: surrealAdapter(db),
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			if (ctx.path === '/sign-in/username') {
				const db = await getDB();

				try {
					const { username, password } = ctx.body;
					await db.signin({
						access: 'user',
						variables: { username, password },
					});
				} catch (error) {
					const message = (error as Error).message;
					const code = message.split(
						'An error occurred: ',
					)[1] as AuthErrorCodes;

					const authError = parseAuthError(code, message);
					throw new APIError('UNAUTHORIZED', { code, ...authError });
				}
			}

			if (ctx.path === '/sign-out') {
				const db = await getDB();
				await db.invalidate();
			}
		}),
	},
});
