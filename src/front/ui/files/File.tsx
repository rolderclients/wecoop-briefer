import { RingProgress } from '@mantine/core';
import {
	IMAGE_MIME_TYPE,
	MS_EXCEL_MIME_TYPE,
	MS_POWERPOINT_MIME_TYPE,
	MS_WORD_MIME_TYPE,
	PDF_MIME_TYPE,
} from '@mantine/dropzone';
import {
	IconFile,
	IconFileTypeDoc,
	IconFileTypePdf,
	IconFileTypePpt,
	IconFileTypeXls,
	IconPhoto,
} from '@tabler/icons-react';
import type { File as FyleType } from '@/types';
import { useFiles } from './Provider';

export const File = ({ file }: { file: FyleType }) => {
	const { fileProgressHandler } = useFiles();

	const progress = fileProgressHandler(file);

	switch (true) {
		case progress >= 0 && progress < 1:
			return (
				<RingProgress
					size={36}
					thickness={4}
					sections={[{ value: progress * 100, color: 'blue' }]}
				/>
			);

		case IMAGE_MIME_TYPE.includes(
			file.type as (typeof IMAGE_MIME_TYPE)[number],
		):
			return (
				<IconPhoto size={36} stroke={1.5} color="var(--mantine-color-dimmed)" />
			);
		case PDF_MIME_TYPE.includes(file.type as (typeof PDF_MIME_TYPE)[number]):
			return (
				<IconFileTypePdf
					size={36}
					stroke={1.5}
					color="var(--mantine-color-dimmed)"
				/>
			);
		case MS_WORD_MIME_TYPE.includes(
			file.type as (typeof MS_WORD_MIME_TYPE)[number],
		):
			return (
				<IconFileTypeDoc
					size={36}
					stroke={1.5}
					color="var(--mantine-color-dimmed)"
				/>
			);
		case MS_EXCEL_MIME_TYPE.includes(
			file.type as (typeof MS_EXCEL_MIME_TYPE)[number],
		):
			return (
				<IconFileTypeXls
					size={36}
					stroke={1.5}
					color="var(--mantine-color-dimmed)"
				/>
			);
		case MS_POWERPOINT_MIME_TYPE.includes(
			file.type as (typeof MS_POWERPOINT_MIME_TYPE)[number],
		):
			return (
				<IconFileTypePpt
					size={36}
					stroke={1.5}
					color="var(--mantine-color-dimmed)"
				/>
			);
		default:
			return (
				<IconFile size={36} stroke={1.5} color="var(--mantine-color-dimmed)" />
			);
	}
};
