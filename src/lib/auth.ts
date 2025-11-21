import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { reactStartCookies } from 'better-auth/react-start';
import { surrealAdapter } from './authDbAdapter/adapter';

const endpoint = process.env.SURREALDB_URL;
const namespace = process.env.SURREALDB_NAMESPACE;
const database = process.env.SURREALDB_DATABASE;
const username = process.env.SURREALDB_USERNAME;
const password = process.env.SURREALDB_PASSWORD;

if (!endpoint || !namespace || !database || !username || !password) {
	throw new Error('Missing required SurrealDB environment variables');
}

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
	plugins: [reactStartCookies(), admin()],
	database: surrealAdapter({
		endpoint,
		namespace,
		database,
		authentication: { username, password },
	}),
});
