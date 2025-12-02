import { useUploadFiles } from '@better-upload/client';
import type {
	ClientUploadErrorClass,
	UploadHookProps,
} from '@better-upload/client/internal';
import { notifications } from '@mantine/notifications';

const codes: Record<ClientUploadErrorClass['type'], string> = {
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

export const useUpload = (props: UploadHookProps<true>) => {
	return useUploadFiles({
		...props,
		onUploadComplete: () => {
			notifications.show({
				message: 'Загрузка файла завершена',
				color: 'green',
			});
		},
		onError: (error) => {
			notifications.show({
				title: codes[error.type],
				message: error.message,
				color: 'red',
				autoClose: 5000,
			});
		},
	});
};
