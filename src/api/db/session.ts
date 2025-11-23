import { createServerOnlyFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import type { SurrealSession } from 'surrealdb';
import { auth } from '@/lib';
import { getDBFn } from './connection';

const sessions = new Map<string, SurrealSession>();

export const getDbSessionFn = createServerOnlyFn(
	async (userId?: string): Promise<SurrealSession> => {
		const headers = getRequestHeaders();

		let sessionUserId: string | undefined;

		if (userId) {
			const { sessions } = await auth.api.listUserSessions({
				headers,
				body: { userId },
			});
			sessionUserId = sessions?.[0]?.userId;
		} else {
			const s = await auth.api.getSession({ headers });
			sessionUserId = s?.session?.userId;
		}

		if (sessionUserId && sessions.has(sessionUserId)) {
			const dbSession = sessions.get(sessionUserId);
			if (dbSession) return dbSession;
		}

		const db = await getDBFn();

		const dbSession = await db.newSession();
		await dbSession.use({ namespace: db.namespace, database: db.database });

		if (sessionUserId && dbSession.session)
			sessions.set(sessionUserId, dbSession);

		return dbSession;
	},
);
