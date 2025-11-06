import { createServerOnlyFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { DateTime, Surreal } from 'surrealdb';

let db: Surreal | null = null;

export const getDB = createServerOnlyFn(async (): Promise<Surreal> => {
	if (db?.isConnected) return db;

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
		const username = process.env.SURREALDB_USER;
		const password = process.env.SURREALDB_PASSWORD;

		if (!url || !namespace || !database || !username || !password) {
			throw new Error('Missing required SurrealDB environment variables');
		}

		// Connect to the database
		await db.connect(url, { reconnect: true });

		// Select a specific namespace / database
		await db.use({
			namespace,
			database,
		});

		// Signin as root user
		await db.signin({
			username,
			password,
		});

		console.log('Connected to SurrealDB');
		return db;
	} catch (error) {
		console.error('Failed to connect to SurrealDB:', error);
		db = null;
		throw error;
	}
});
