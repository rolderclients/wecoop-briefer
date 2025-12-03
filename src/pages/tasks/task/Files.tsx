import {
	IMAGE_MIME_TYPE,
	MS_EXCEL_MIME_TYPE,
	MS_POWERPOINT_MIME_TYPE,
	MS_WORD_MIME_TYPE,
	PDF_MIME_TYPE,
} from '@mantine/dropzone';
import { Files, useFiles } from '@/front';

export const TaskFiles = ({ taskId }: { taskId: string }) => {
	const { upload } = useFiles();

	return (
		<Files.Root
			mt="auto"
			accept={[
				...IMAGE_MIME_TYPE,
				...PDF_MIME_TYPE,
				...MS_WORD_MIME_TYPE,
				...MS_EXCEL_MIME_TYPE,
				...MS_POWERPOINT_MIME_TYPE,
			]}
			onDrop={(files) => upload(files, taskId)}
		/>
	);
};
