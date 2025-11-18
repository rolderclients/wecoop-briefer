import { createServerOnlyFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { DateTime, Surreal } from 'surrealdb';
import { useAppSession } from '../auth/useAppSession';

let db: Surreal | null = null;
let authEventListener: (() => void) | null = null;

export const getDB = createServerOnlyFn(async (): Promise<Surreal> => {
	const session = await useAppSession();
	const { data } = session;

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
			authentication: data.tokens?.access,
		});

		await db.use({
			namespace,
			database,
		});

		// Set up auth event listener
		if (!authEventListener) {
			console.log('🎧 Setting up auth event listener');
			authEventListener = db.subscribe('auth', async (tokens) => {
				// Add a small delay to avoid conflicts with login process
				setTimeout(async () => {
					if (tokens) {
						console.log('🔔 Auth event: New tokens received', {
							hasAccess: !!tokens.access,
							hasRefresh: !!tokens.refresh,
						});

						// Only update if we don't already have these tokens
						const currentData = session.data;
						const currentTokens = currentData?.tokens;

						if (!currentTokens || currentTokens.access !== tokens.access) {
							// await session.update({
							// 	...currentData,
							// 	tokens: {
							// 		access: tokens.access,
							// 		refresh: tokens.refresh,
							// 	},
							// });
							console.log('✅ Session updated via auth event');
						} else {
							console.log(
								'🔔 Auth event: Tokens already up to date, skipping update',
							);
						}
					} else {
						console.log('🔔 Auth event: Session invalidated');
						// Only clear if we actually have a session
						const currentData = session.data;
						if (currentData?.user) {
							await session.clear();
							console.log('🧹 Session cleared due to auth invalidation');
						}
					}
				}, 100); // Small delay to let login complete first
			});
		}

		console.log('Connected to SurrealDB');
		return db;
	} catch (error) {
		console.error('Failed to connect to SurrealDB:', error);
		db = null;
		throw error;
	}
});
