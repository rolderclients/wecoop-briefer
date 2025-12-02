import { Group, Text } from '@mantine/core';
import { Dropzone, type DropzoneProps } from '@mantine/dropzone';
import { IconFile, IconUpload, IconX } from '@tabler/icons-react';
import { useFiles } from './Provider';

export const Root = (props: DropzoneProps) => {
	const { isPending } = useFiles();

	return (
		<Dropzone
			radius="md"
			// onReject={(files) => console.log('rejected files', files)}
			maxFiles={10}
			maxSize={1024 * 1024 * 5}
			loading={isPending}
			// accept={IMAGE_MIME_TYPE}
			{...props}
		>
			<Group wrap="nowrap" style={{ pointerEvents: 'none' }}>
				<Dropzone.Accept>
					<IconUpload
						size={52}
						color="var(--mantine-color-blue-6)"
						stroke={1.5}
					/>
				</Dropzone.Accept>
				<Dropzone.Reject>
					<IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
				</Dropzone.Reject>
				<Dropzone.Idle>
					<IconFile
						size={52}
						color="var(--mantine-color-dimmed)"
						stroke={1.5}
					/>
				</Dropzone.Idle>

				<div>
					<Text size="lg" inline>
						Перетащите или выберите файлы
					</Text>
					<Text size="sm" c="dimmed" inline mt={7}>
						Можно загрузить до 10 файлов. Каждый файл не должен превышать 5 мб.
					</Text>
				</div>
			</Group>
		</Dropzone>
	);
};
