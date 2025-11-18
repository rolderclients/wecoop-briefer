import { createServerOnlyFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { DateTime, Surreal } from 'surrealdb';
import { useAppSession } from '../auth/useAppSession';

let db: Surreal | null = null;

export const getDB = createServerOnlyFn(async (): Promise<Surreal> => {
	const { data } = await useAppSession();

	if (db?.isConnected) return db;

	// Нужно чтобы был в корне для получения контекста запроса серверной функции
	const locale = getCookie('locale') || 'ru-RU';
	const timeZone = getCookie('tz') || 'UTC';

	db = new Surreal({
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
		const url = process.env.SURREALDB_URL;
		const namespace = process.env.SURREALDB_NAMESPACE;
		const database = process.env.SURREALDB_DATABASE;

		if (!url || !namespace || !database) {
			throw new Error('Missing required SurrealDB environment variables');
		}

		await db.connect(url, {
			reconnect: true,
			authentication: data.token,
		});

		await db.use({
			namespace,
			database,
		});

		console.log('Connected to SurrealDB');
		return db;
	} catch (error) {
		console.error('Failed to connect to SurrealDB:', error);
		db = null;
		throw error;
	}
});
