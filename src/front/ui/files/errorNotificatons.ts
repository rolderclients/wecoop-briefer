import type { ClientUploadError } from '@better-upload/client';
import { notifications } from '@mantine/notifications';
import type { FileRejection } from 'react-dropzone';

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

export const serverErrorNotificaton = (error: ClientUploadError) => {
	notifications.show({
		title: serverErrorCodes[error.type],
		message: error.message,
		color: 'red',
		autoClose: false,
	});
};

const clientErrorCodes: Record<string, string> = {
	'file-invalid-type': 'Неверный тип файла',
	'file-too-large': 'Файл слишком большой',
	'file-too-small': 'Файл слишком маленький',
	'too-many-files': 'Слишком много файлов',
};

export const clientRejectionsNotificatons = (rejections: FileRejection[]) => {
	if (
		rejections
			.flatMap((i) => i.errors.map((e) => e.code))
			.some((code) => code === 'too-many-files')
	) {
		notifications.show({
			message: clientErrorCodes['too-many-files'],
			color: 'orange',
			autoClose: 5000,
		});

		return;
	}

	for (const rejection of rejections) {
		const { errors, file } = rejection;
		for (const error of errors) {
			const code = error.code;
			const message = file.name;
			notifications.show({
				title: clientErrorCodes[code],
				message,
				color: 'orange',
				autoClose: 5000,
			});
		}
	}
};
