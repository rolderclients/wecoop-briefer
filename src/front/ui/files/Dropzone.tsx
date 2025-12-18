import { Grid, Text } from '@mantine/core';
import {
	type DropzoneProps,
	Dropzone as MantineDropzone,
} from '@mantine/dropzone';
import { IconFile, IconUpload, IconX } from '@tabler/icons-react';
import numbro from 'numbro';
import { useFiles } from './Provider';
import classes from './styles.module.css';

export const Dropzone = ({
	children,
	...props
}: Omit<
	DropzoneProps,
	'onDrop' | 'onReject' | 'accept' | 'maxFiles' | 'maxSize'
>) => {
	const {
		accept,
		maxFilesTotal,
		maxFilesPerUpload,
		maxFileSize,
		onDrop,
		onReject,
		isPending,
	} = useFiles();

	return (
		<MantineDropzone
			radius="md"
			accept={accept}
			maxFiles={maxFilesPerUpload}
			maxSize={maxFileSize}
			onDrop={onDrop}
			onReject={onReject}
			disabled={isPending}
			className={isPending ? classes.disabled : ''}
			{...props}
		>
			<Grid align="center" style={{ pointerEvents: 'none' }}>
				<Grid.Col span="content" p={0}>
					<MantineDropzone.Accept>
						<IconUpload
							size={52}
							color="var(--mantine-color-blue-6)"
							stroke={1.5}
						/>
					</MantineDropzone.Accept>
					<MantineDropzone.Reject>
						<IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
					</MantineDropzone.Reject>
					<MantineDropzone.Idle>
						<IconFile
							size={52}
							color="var(--mantine-color-dimmed)"
							stroke={1.5}
						/>
					</MantineDropzone.Idle>
				</Grid.Col>

				<Grid.Col span="auto">
					<Text size="lg" inline>
						Перетащите или выберите файлы
					</Text>
					<Text size="sm" c="dimmed" mt={7}>
						Можно загрузить до {maxFilesTotal} файлов. Каждый файл не должен
						превышать{' '}
						{numbro(maxFileSize).format({
							output: 'byte',
							base: 'binary',
							spaceSeparated: true,
						})}
					</Text>
				</Grid.Col>
			</Grid>
		</MantineDropzone>
	);
};
