import { createServerFn } from '@tanstack/react-start';
import { useAppSession } from './useAppSession';

export const getAppSession = createServerFn({ method: 'GET' }).handler(
	async () => {
		const session = await useAppSession();
		const data = session.data;

		if (!data) {
			return null;
		}

		return data;
	},
);
