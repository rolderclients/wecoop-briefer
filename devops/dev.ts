import { env } from './env';

export const setDev = () => {
	const {
		SURREALDB_URL,
		SURREALDB_NAMESPACE,
		SURREALDB_DATABASE,
		SURREALDB_USERNAME,
		SURREALDB_PASSWORD,
		BETTER_AUTH_SECRET,
		AI_GATEWAY_API_KEY,
	} = env;

	new sst.x.DevCommand('DevServer', {
		dev: {
			title: 'Dev server',
			autostart: true,
			command: 'vite dev',
		},
		environment: {
			SURREALDB_URL: SURREALDB_URL.dev,
			SURREALDB_NAMESPACE: SURREALDB_NAMESPACE.dev,
			SURREALDB_DATABASE: SURREALDB_DATABASE.dev,
			SURREALDB_USERNAME: SURREALDB_USERNAME.dev,
			SURREALDB_PASSWORD: SURREALDB_PASSWORD.dev,
			BETTER_AUTH_URL: 'http://localhost:3000',
			BETTER_AUTH_SECRET: BETTER_AUTH_SECRET.dev,
			AI_GATEWAY_API_KEY: AI_GATEWAY_API_KEY.dev,
		},
	});
};
