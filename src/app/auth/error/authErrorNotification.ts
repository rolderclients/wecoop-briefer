import { notifications } from '@mantine/notifications';
import type { ParsedAuthError } from './types';

export const authErrorNotification = (error: ParsedAuthError) =>
	notifications.show({
		title: error.message,
		message: error.details,
		color: 'red',
		autoClose: 5000,
	});
