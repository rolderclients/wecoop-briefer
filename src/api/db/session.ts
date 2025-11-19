import { createServerOnlyFn } from '@tanstack/react-start';
import type { SurrealSession } from 'surrealdb';
import { useAppSession } from '../auth/useAppSession';
import { getDB } from './connection';

const sessions = new Map<string, SurrealSession>();

export const getDbSession = createServerOnlyFn(
	async (): Promise<SurrealSession> => {
		const appSession = await useAppSession();

		if (appSession.id && sessions.has(appSession.id)) {
			const dbSession = sessions.get(appSession.id);
			if (dbSession) return dbSession;
		}

		const db = await getDB();

		const dbSession = await db.newSession();
		await dbSession.use({ namespace: db.namespace, database: db.database });

		if (appSession.id && dbSession.session)
			sessions.set(appSession.id, dbSession);

		return dbSession;
	},
);
