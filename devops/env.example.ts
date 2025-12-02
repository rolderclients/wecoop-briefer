export const env = {
	// ### Project ####################################################################
	projectName: 'wecoop',
	appName: 'briefer',
	projectId: 'prj-...',
	domain: {
		dev: 'rolder.dev',
		test: 'rolder.dev',
		prod: 'rolder.dev',
	},
	subDomain: {
		dev: 'dev.briefer.wecoop',
		test: 'test.briefer.wecoop',
		prod: 'briefer.wecoop',
	},
	// ### Render #####################################################################
	repoUrl: 'https://github.com/rolderclients/wecoop-briefer',
	branch: {
		dev: 'master',
		test: 'test',
		prod: 'prod',
	},
	// ### Yandex Cloud ###############################################################
	bucket: 'rolder-wecoop',
	// ### SurrealDB ##################################################################
	SURREALDB_URL: {
		dev: 'wss://dt.db.wecoop.rolder.dev',
		test: 'wss://dt.db.wecoop.rolder.dev',
		prod: 'wss://db.wecoop.rolder.dev',
	},
	SURREALDB_NAMESPACE: {
		dev: 'dev',
		test: 'test',
		prod: 'prod',
	},
	SURREALDB_DATABASE: {
		dev: 'data',
		test: 'data',
		prod: 'data',
	},
	SURREALDB_PASSWORD: {
		dev: 'password',
		test: 'password',
		prod: 'password',
	},
	SURREALDB_USERNAME: {
		dev: 'root',
		test: 'root',
		prod: 'root',
	},
	// ### Better Auth ################################################################
	BETTER_AUTH_URL: {
		dev: 'https://dev.briefer.wecoop.rolder.dev',
		test: 'https://test.briefer.wecoop.rolder.dev',
		prod: 'https://briefer.wecoop.rolder.dev',
	},
	BETTER_AUTH_SECRET: {
		dev: 'secret',
		test: 'secret',
		prod: 'secret',
	},
	// ### Vercel AI Gateway ##########################################################
	AI_GATEWAY_API_KEY: {
		dev: 'api_key',
		test: 'api_key',
		prod: 'api_key',
	},
} as const;
