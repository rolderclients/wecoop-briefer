import { notifications } from '@mantine/notifications';
import { parseAuthError } from './parseAuthError';
import type { AuthError } from './types';

export const authErrorNotification = (error: AuthError) => {
	// biome-ignore lint/suspicious/noExplicitAny: <>
	const parsedError = parseAuthError(error?.code as any, error?.message);
	notifications.show({
		title: parsedError.message,
		message: parsedError.details,
		color: 'red',
		autoClose: 5000,
	});
};
