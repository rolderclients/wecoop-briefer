import {
	IMAGE_MIME_TYPE,
	MS_EXCEL_MIME_TYPE,
	MS_POWERPOINT_MIME_TYPE,
	MS_WORD_MIME_TYPE,
	PDF_MIME_TYPE,
} from '@mantine/dropzone';
import { forwardRef } from 'react';
import { Files, type FilesRef } from '@/front';

export const TaskFiles = forwardRef<FilesRef, { taskId: string }>(
	({ taskId }, ref) => {
		return (
			<Files.Root
				ref={ref}
				route="upload"
				api="/api/files/upload"
				taskId={taskId}
				fileTypes={[
					...IMAGE_MIME_TYPE,
					...PDF_MIME_TYPE,
					...MS_WORD_MIME_TYPE,
					...MS_EXCEL_MIME_TYPE,
					...MS_POWERPOINT_MIME_TYPE,
				]}
				maxFilesTotal={10}
				maxFilesPerUpload={10}
				maxFileSize={1024 * 1024 * 10}
			>
				<Files.Content mt="auto" pb="sm">
					<Files.List />
					<Files.Dropzone />
				</Files.Content>
			</Files.Root>
		);
	},
);
