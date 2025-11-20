import { betterAuth } from 'better-auth';
import { reactStartCookies } from 'better-auth/react-start';
import Database from 'better-sqlite3';

export const auth = betterAuth({
	database: new Database('./sqlite.db'),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [reactStartCookies()],
});
