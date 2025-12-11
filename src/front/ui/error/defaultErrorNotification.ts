import { notifications } from '@mantine/notifications';

export const defaultErrorNotification = (error: Error) =>
	notifications.show({
		title: 'Системная ошибка',
		message: error.message,
		color: 'red',
		autoClose: false,
	});
