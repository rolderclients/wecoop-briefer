import { createServerFn } from '@tanstack/react-start';
import { getDbSession } from '../db';
import { useAppSession } from './useAppSession';

export const getSessionUser = createServerFn({ method: 'GET' }).handler(
	async () => {
		// const appSession = await useAppSession();

		// const appUser = appSession.data.user;
		// if (!appUser) return null;

		// const dbSession = await getDbSession();
		// if (!dbSession.accessToken) {
		// 	appSession.clear();
		// 	return null;
		// }

		// return appUser;
		return null;
	},
);
