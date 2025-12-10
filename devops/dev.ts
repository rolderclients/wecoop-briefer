import { env } from './env';
import { readFile } from './utils';

export const setDev = () => {
	const {
		SURREALDB_URL,
		SURREALDB_NAMESPACE,
		SURREALDB_DATABASE,
		SURREALDB_USERNAME,
		SURREALDB_PASSWORD,
		BETTER_AUTH_SECRET,
		AI_GATEWAY_API_KEY,
		bucket,
	} = env;

	const yandexStorageKeys = readFile('yc_storage_keys.json');

	const environment = {
		SURREALDB_URL: SURREALDB_URL.dev,
		SURREALDB_NAMESPACE: SURREALDB_NAMESPACE.dev,
		SURREALDB_DATABASE: SURREALDB_DATABASE.dev,
		SURREALDB_USERNAME: SURREALDB_USERNAME.dev,
		SURREALDB_PASSWORD: SURREALDB_PASSWORD.dev,
		BETTER_AUTH_URL: 'http://localhost:3000',
		BETTER_AUTH_SECRET: BETTER_AUTH_SECRET.dev,
		AI_GATEWAY_API_KEY: AI_GATEWAY_API_KEY.dev,
		BUCKET_NAME: bucket.dev,
		YANDEX_STORAGE_ACCESS_KEY: yandexStorageKeys.accessKey,
		YANDEX_STORAGE_SECRET_KEY: yandexStorageKeys.secretKey,
	};

	new sst.x.DevCommand('DevServer', {
		dev: {
			title: 'Dev server',
			autostart: true,
			command: 'vite dev',
		},
		environment,
	});

	new sst.x.DevCommand('SetupDBSchema', {
		dev: {
			title: 'Setup DB Schema',
			autostart: false,
			command: 'bun ./src/back/db/setup.ts',
		},
		environment,
	});
};
