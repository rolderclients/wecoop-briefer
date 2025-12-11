import { useUploadFiles } from '@better-upload/client';
import type { UploadHookProps } from '@better-upload/client/internal';
import type { DropzoneProps } from '@mantine/dropzone';
import {
	IMAGE_MIME_TYPE,
	MS_EXCEL_MIME_TYPE,
	MS_POWERPOINT_MIME_TYPE,
	MS_WORD_MIME_TYPE,
	PDF_MIME_TYPE,
} from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { useSuspenseQuery } from '@tanstack/react-query';
import { nanoid } from 'nanoid/non-secure';
import { createContext, useContext } from 'react';
import type { FileWithPath } from 'react-dropzone';
import { deleteObjectFn, getSignedFilesUrlsFn } from '@/back';
import {
	createFilesFn,
	deleteFilesFn,
	filesQueryOptions,
} from '@/back/db/repositories/file';
import { downloadFileByURL, useMutaitionWithInvalidate } from '@/front';
import type { CreateFile, File } from '@/types';
import {
	clientRejectionsNotificatons,
	serverErrorNotificaton,
} from './errorNotificatons';

interface FilesContext {
	files: File[];
	onDrop: DropzoneProps['onDrop'];
	onReject: DropzoneProps['onReject'];
	deleteFile: (file: File) => void;
	downloadAllFiles: () => Promise<void>;
	accept: string[];
	maxFilesTotal: number;
	maxFilesPerUpload: number;
	maxFileSize: number;
	isPending: boolean;
	fileProgressHandler: (file: File) => number;
}

export interface FilesProps extends UploadHookProps<true> {
	children: React.ReactNode;
	api: string;
	taskId: string;
	fileTypes?: string[];
	maxFilesTotal?: number;
	maxFilesPerUpload?: number;
	maxFileSize?: number;
}

const FilesContext = createContext<FilesContext | null>(null);

export const Provider = ({
	children,
	taskId,
	fileTypes = [
		...IMAGE_MIME_TYPE,
		...PDF_MIME_TYPE,
		...MS_WORD_MIME_TYPE,
		...MS_EXCEL_MIME_TYPE,
		...MS_POWERPOINT_MIME_TYPE,
	],
	maxFilesTotal = 10,
	maxFilesPerUpload = 10,
	maxFileSize = 1024 * 1024 * 10,
	...props
}: FilesProps) => {
	const { data: files } = useSuspenseQuery(filesQueryOptions(taskId));

	const { upload, isPending, progresses } = useUploadFiles({
		...props,
		onError: serverErrorNotificaton,
	});

	const createManyMutation = useMutaitionWithInvalidate<CreateFile[]>(
		createFilesFn,
		['files', taskId],
	);

	const deleteMutation = useMutaitionWithInvalidate<string[]>(deleteFilesFn, [
		'files',
		taskId,
	]);

	const value: FilesContext = {
		files,
		onDrop: (newFiles) => {
			const duplicateNames = [];
			let filteredNewFiles: FileWithPath[] = [];
			for (const file of newFiles) {
				if (files.some((f) => f.originalName === file.name))
					duplicateNames.push(file.name);
				else filteredNewFiles.push(file);
			}

			if (duplicateNames.length > 0) {
				notifications.show({
					title: 'Файлы уже загружены',
					message: duplicateNames.join(', '),
					color: 'orange',
				});
			}

			if (filteredNewFiles.length) {
				const spaceLeft = maxFilesTotal - files.length;
				if (spaceLeft < filteredNewFiles.length) {
					const skippedFileNames = filteredNewFiles
						.slice(spaceLeft)
						.map((file) => file.name);

					notifications.show({
						title: 'Превышен лимит файлов',
						message: `Пропущенные файлы: ${skippedFileNames.join(', ')}`,
						color: 'orange',
					});

					filteredNewFiles = filteredNewFiles.slice(0, spaceLeft);
				}
			}

			const s3Keys: Record<string, string> = {};
			if (filteredNewFiles.length) {
				createManyMutation.mutate(
					filteredNewFiles.map((i) => {
						const ext = i.name.split('.').pop();
						const s3Key = `${nanoid()}.${ext}`;
						s3Keys[i.name] = s3Key;

						return {
							originalName: i.name,
							s3Key,
							type: i.type,
							size: i.size,
							task: taskId,
						};
					}),
				);

				upload(filteredNewFiles, {
					metadata: {
						s3Keys,
						fileTypes,
						maxFiles: maxFilesPerUpload,
						maxFileSize,
					},
				});
			}
		},
		onReject: clientRejectionsNotificatons,
		deleteFile: (file) => {
			deleteObjectFn({ data: file.s3Key });
			deleteMutation.mutate([file.id]);
		},
		downloadAllFiles: async () => {
			try {
				const fileUrls = await getSignedFilesUrlsFn({
					data: { s3Keys: files.map((file) => file.s3Key) },
				});

				for (const [index, file] of files.entries()) {
					downloadFileByURL(fileUrls[index], file.originalName);
				}
			} catch (error) {
				console.error(error);
				notifications.show({
					title: 'Ошибка скачивания',
					message: `Не удалось получить ссылки на файлы: ${error}`,
					color: 'red',
				});
			}
		},
		accept: fileTypes,
		maxFilesTotal,
		maxFilesPerUpload,
		maxFileSize,
		isPending: isPending || createManyMutation.isPending,
		fileProgressHandler: (file: File) => {
			const fileProgress = progresses.find(
				(p) => p.raw.name === file.originalName,
			);

			return fileProgress ? fileProgress.progress : -1;
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
