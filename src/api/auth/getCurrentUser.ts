import { createServerFn } from '@tanstack/react-start';
import type { SecuredUser } from '../db';
import { useAppSession } from './useAppSession';

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
	async () => {
		const session = await useAppSession();
		const userId = session.data.id;

		if (!userId) {
			return null;
		}

		return session.data as SecuredUser;
	},
);
