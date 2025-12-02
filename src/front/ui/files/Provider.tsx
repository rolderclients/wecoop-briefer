import { useUploadFiles } from '@better-upload/client';
import type {
	DirectUploadResult,
	UploadHookProps,
	UploadHookReturn,
} from '@better-upload/client/internal';
import { notifications } from '@mantine/notifications';
import { createContext, useContext } from 'react';
import type { FileWithPath } from 'react-dropzone';
import { errorNotificaton } from './errorNotificaton';

interface FilesContext extends Omit<UploadHookReturn<true>, 'upload'> {
	upload: (
		files: FileWithPath[],
		path?: string,
	) => Promise<DirectUploadResult<true>>;
}

export interface FilesProps extends UploadHookProps<true> {
	children: React.ReactNode;
}

const FilesContext = createContext<FilesContext | null>(null);

export const Provider = ({ children, ...props }: FilesProps) => {
	const uploadFiles = useUploadFiles({
		...props,
		onUploadComplete: () => {
			notifications.show({
				message: 'Загрузка файла завершена',
				color: 'green',
			});
		},
		onError: errorNotificaton,
	});

	const value: FilesContext = {
		...uploadFiles,
		upload: async (files, path) => {
			if (path) return await uploadFiles.upload(files, { metadata: { path } });
			return await uploadFiles.upload(files);
		},
	};

	return (
		<FilesContext.Provider value={value}>{children}</FilesContext.Provider>
	);
};

export const useFiles = () => {
	const context = useContext(FilesContext);
	if (!context) {
		throw new Error('useFiles must be used within FilesProvider');
	}
	return context;
};
