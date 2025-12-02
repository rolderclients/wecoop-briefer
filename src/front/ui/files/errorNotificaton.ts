import type { ClientUploadError } from '@better-upload/client';
import { notifications } from '@mantine/notifications';

const serverErrorCodes: Record<ClientUploadError['type'], string> = {
	unknown: 'Неизвестная ошибка',
	invalid_request: 'Неверный запрос',
	aborted: 'Загрузка прервана',
	rejected: 'Файл отклонен',
	s3_upload: 'Ошибка при загрузке на S3',
	no_files: 'Нет файлов для загрузки',
	file_too_large: 'Один или несколько файлов слишком большие',
	invalid_file_type: 'Один или несколько файлов неверного типа',
	too_many_files: 'Слишком много файлов',
};

export const errorNotificaton = (error: ClientUploadError) => {
	notifications.show({
		title: serverErrorCodes[error.type],
		message: error.message,
		color: 'red',
		autoClose: 5000,
	});
};
