import { createServerOnlyFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import type { SurrealSession } from 'surrealdb';
import { auth } from '@/lib';
import { getDBFn } from './connection';

const sessions = new Map<string, SurrealSession>();

export const getDbSessionFn = createServerOnlyFn(
	async (inputSessionId?: string): Promise<SurrealSession> => {
		const headers = getRequestHeaders();

		let sessionId = inputSessionId;

		if (!sessionId) {
			const s = await auth.api.getSession({ headers });
			sessionId = s?.session?.id;
		}

		if (sessionId && sessions.has(sessionId)) {
			const dbSession = sessions.get(sessionId);
			if (dbSession) return dbSession;
		}

		const db = await getDBFn();

		const dbSession = await db.newSession();
		await dbSession.use({ namespace: db.namespace, database: db.database });

		if (sessionId) sessions.set(sessionId, dbSession);

		return dbSession;
	},
);
