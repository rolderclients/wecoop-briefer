import { createServerOnlyFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { Resource } from 'sst';
import { DateTime, Surreal } from 'surrealdb';

let db: Surreal | null = null;

export const getDBFn = createServerOnlyFn(async (): Promise<Surreal> => {
	if (db?.isConnected) return db;

	// Нужно чтобы был в корне для получения контекста запроса серверной функции
	const locale = getCookie('locale') || 'ru-RU';
	const timeZone = getCookie('tz') || 'UTC';

	const instance = new Surreal({
		codecOptions: {
			valueDecodeVisitor(value) {
				if (value instanceof DateTime) {
					return new Date(value.toDate()).toLocaleDateString(locale, {
						hour: 'numeric',
						minute: 'numeric',
						timeZone,
					});
				}
				return value;
			},
		},
	});

	try {
		const {
			db: { url, namespace, database, username, password },
		} = Resource.Project;

		if (!url || !namespace || !database || !username || !password) {
			throw new Error('Missing required SurrealDB environment variables');
		}

		await instance.connect(url, { authentication: { username, password } });

		await instance.use({
			namespace,
			database,
		});

		db = instance;

		console.log('Connected to SurrealDB');

		return instance;
	} catch (error) {
		console.error('Failed to connect to SurrealDB:', error);
		db = null;
		throw error;
	}
});
