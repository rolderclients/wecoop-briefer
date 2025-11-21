import { createServerOnlyFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import type { SurrealSession } from 'surrealdb';
import { auth } from '@/lib';
import { getDBFn } from './connection';

const sessions = new Map<string, SurrealSession>();

export const getDbSessionFn = createServerOnlyFn(
	async (): Promise<SurrealSession> => {
		const headers = getRequestHeaders();

		const authSession = await auth.api.getSession({ headers });

		if (authSession?.session.id && sessions.has(authSession.session.id)) {
			const dbSession = sessions.get(authSession.session.id);
			if (dbSession) return dbSession;
		}

		const db = await getDBFn();

		const dbSession = await db.newSession();
		await dbSession.use({ namespace: db.namespace, database: db.database });

		if (authSession?.session.id && dbSession.session)
			sessions.set(authSession.session.id, dbSession);

		return dbSession;
	},
);
