import { createNodeEngines } from '@surrealdb/node';
import { runAdapterTest } from 'better-auth/adapters/test';
import { Surreal } from 'surrealdb';
import { describe } from 'vitest';
import { surrealAdapter } from '../adapter';

const db = new Surreal({ engines: createNodeEngines() });
await db.connect('mem://');
await db.use({ namespace: 'test', database: 'test' });

describe('SurrealDB Adapter', async () => {
	const adapter = surrealAdapter(db, {
		debugLogs: {
			isRunningAdapterTests: true,
		},
	});

	await runAdapterTest({
		getAdapter: async (betterAuthOptions = {}) => {
			return adapter(betterAuthOptions);
		},
	});
});
